import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ success: false }, { status: 400 });
    const { rows } = await pool.query(
      `SELECT r.*, u.fullname as user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );
    const avg = rows.length > 0
      ? rows.reduce((s: number, r: any) => s + r.rating, 0) / rows.length
      : 0;
    return NextResponse.json({ success: true, reviews: rows, average: avg, total: rows.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { orderId, productId, userId, rating, comment } = await req.json();
    if (!productId || !userId || !rating) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }
    // Cek apakah sudah pernah review produk ini dari order ini
    const existing = await pool.query(
      "SELECT id FROM reviews WHERE order_id = $1 AND product_id = $2 AND user_id = $3",
      [orderId, productId, userId]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: "Kamu sudah mengulas produk ini" }, { status: 400 });
    }
    await pool.query(
      "INSERT INTO reviews (order_id, product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4, $5)",
      [orderId, productId, userId, rating, comment || ""]
    );
    // Update rata-rata rating di tabel products
    const avg = await pool.query(
      "SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = $1",
      [productId]
    );
    await pool.query(
      "UPDATE products SET rating = $1, review_count = $2 WHERE id = $3",
      [parseFloat(Number(avg.rows[0].avg).toFixed(1)), avg.rows[0].count, productId]
    );
    return NextResponse.json({ success: true, message: "Ulasan berhasil dikirim!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan ulasan" }, { status: 500 });
  }
}
