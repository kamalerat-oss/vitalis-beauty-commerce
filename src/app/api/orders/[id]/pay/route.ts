import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    let paymentDetail: string | undefined;
    try {
      const body = await req.json();
      paymentDetail = body?.paymentDetail;
    } catch {
      // body kosong/tidak ada, tidak masalah
    }

    // Ambil data order lengkap dulu
    const { rows: orderRows } = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    if (orderRows.length === 0) {
      return NextResponse.json({ success: false, message: "Order tidak ditemukan" }, { status: 404 });
    }

    const order = orderRows[0];

    if (order.status !== "pending") {
      return NextResponse.json({
        success: false,
        message: "Order ini sudah diproses sebelumnya",
      }, { status: 400 });
    }

    // Update status jadi "diproses" (artinya pembayaran sudah dikonfirmasi).
    // Jika ada detail bank/e-wallet spesifik (misal "Bank Transfer - BCA"),
    // simpan itu menimpa payment_method yang sebelumnya masih umum.
    if (paymentDetail) {
      await pool.query(
        `UPDATE orders SET status = 'diproses', paid_at = CURRENT_TIMESTAMP, payment_method = $2 WHERE id = $1`,
        [id, paymentDetail]
      );
      order.payment_method = paymentDetail;
    } else {
      await pool.query(
        `UPDATE orders SET status = 'diproses', paid_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
    }

    // Ambil item-item order untuk dimasukkan ke invoice
    const { rows: items } = await pool.query(
      `SELECT oi.*, p.name FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );

    // Coba kirim invoice email, tapi jangan sampai gagal kirim email
    // membuat seluruh request error (pembayaran tetap dianggap berhasil)
    let emailSent = false;
    if (order.customer_email) {
      try {
        await sendInvoiceEmail({
          to: order.customer_email,
          customerName: order.customer_name || "Customer",
          orderId: order.id,
          items: items.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            price: Number(i.price),
          })),
          subtotal: Number(order.subtotal || 0),
          shippingCost: Number(order.shipping_cost || 0),
          total: Number(order.total_price),
          paymentMethod: order.payment_method || "-",
        });
        emailSent = true;
        await pool.query(`UPDATE orders SET invoice_sent = TRUE WHERE id = $1`, [id]);
      } catch (emailError) {
        console.error("Gagal kirim invoice email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran dikonfirmasi",
      emailSent,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal konfirmasi pembayaran" }, { status: 500 });
  }
}
