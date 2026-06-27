import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'customer'"
    );

    return NextResponse.json({ count: Number(rows[0].count) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ count: 0 });
  }
}
