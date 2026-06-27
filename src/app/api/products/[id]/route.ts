import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET single product by id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal mengambil produk" }, { status: 500 });
  }
}

// PATCH - update produk (nama, harga, stok, kategori, dll)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const allowedFields: Record<string, string> = {
      name: "name",
      category: "category",
      price: "price",
      originalPrice: "original_price",
      stock: "stock",
      description: "description",
      ingredients: "ingredients",
      image: "image",
      badge: "badge",
      isBestSeller: "is_best_seller",
      isNew: "is_new",
      rating: "rating",
      reviewCount: "review_count",
      variants: "variants",
    };

    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const key in body) {
      if (allowedFields[key]) {
        setClauses.push(`${allowedFields[key]} = $${i}`);
        values.push(key === "variants" ? JSON.stringify(body[key]) : body[key]);
        i++;
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ada field yang diupdate" }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${i} RETURNING *`;
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update produk" }, { status: 500 });
  }
}

// DELETE - hapus produk
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Produk dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal menghapus produk" }, { status: 500 });
  }
}
