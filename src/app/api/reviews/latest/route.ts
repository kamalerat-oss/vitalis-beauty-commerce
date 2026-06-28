import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
        u.fullname as user_name,
        p.name as product_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
       WHERE r.comment IS NOT NULL AND r.comment != ''
       ORDER BY r.created_at DESC
       LIMIT 3`
    );
    return NextResponse.json({ success: true, reviews: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: true, reviews: [] });
  }
}
