import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");

    let query = `SELECT o.*, u.fullname as user_name, u.email as user_email
             FROM orders o
             LEFT JOIN users u ON u.id = o.user_id
             ORDER BY o.created_at DESC`;
    let params: any[] = [];

    if (orderId) {
      query = `SELECT o.*, u.fullname as user_name, u.email as user_email
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.id = $1
         ORDER BY o.created_at DESC`;
      params = [orderId];
    } else if (userId) {
      query = `SELECT o.*, u.fullname as user_name, u.email as user_email
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`;
      params = [userId];
    }

    const { rows: orders } = await pool.query(query, params);

    for (const order of orders) {
      const { rows: items } = await pool.query(
        `SELECT oi.*, p.name, p.image FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = items;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal mengambil orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      userEmail,
      items,
      subtotal,
      shipping,
      total,
      address,
      paymentMethod,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Keranjang kosong" }, { status: 400 });
    }

    await client.query("BEGIN");

    // Cek stok cukup untuk semua item dulu, sebelum insert apapun
    for (const item of items) {
      const { rows: productRows } = await client.query(
        "SELECT stock, name FROM products WHERE id = $1",
        [item.productId]
      );

      if (productRows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({
          success: false,
          message: `Produk dengan id ${item.productId} tidak ditemukan`,
        }, { status: 400 });
      }

      if (productRows[0].stock < item.quantity) {
        await client.query("ROLLBACK");
        return NextResponse.json({
          success: false,
          message: `Stok "${productRows[0].name}" tidak cukup (tersisa ${productRows[0].stock})`,
        }, { status: 400 });
      }
    }

    const { rows: orderResult } = await client.query(
      `INSERT INTO orders
        (user_id, total_price, status, subtotal, shipping_cost, shipping_address, customer_name, customer_email, payment_method)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        userId,
        total,
        subtotal ?? null,
        shipping ?? null,
        address ? JSON.stringify(address) : null,
        userName ?? null,
        userEmail ?? null,
        paymentMethod ?? null,
      ]
    );
    const orderId = orderResult[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.productId, item.quantity, item.price]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.productId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true, message: "Order berhasil dibuat", orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal membuat order" }, { status: 500 });
  } finally {
    client.release();
  }
}
