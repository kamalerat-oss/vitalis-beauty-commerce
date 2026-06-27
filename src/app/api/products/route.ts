import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM products ORDER BY id ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Gagal mengambil data produk",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      price,
      originalPrice,
      stock,
      description,
      ingredients,
      image,
      badge,
      isBestSeller,
      isNew,
      variants,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json({
        success: false,
        message: "Nama dan harga produk wajib diisi",
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO products
        (name, category, price, original_price, stock, description, ingredients, image, badge, is_best_seller, is_new, rating, review_count, variants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 5.0, 0, $12)
       RETURNING *`,
      [
        name,
        category || null,
        price,
        originalPrice || null,
        stock ?? 0,
        description || null,
        ingredients || null,
        image || null,
        badge || null,
        isBestSeller || false,
        isNew || false,
        variants ? JSON.stringify(variants) : null,
      ]
    );

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Gagal menambahkan produk",
    }, { status: 500 });
  }
}
