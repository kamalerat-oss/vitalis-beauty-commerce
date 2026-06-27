import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `);

    return NextResponse.json({ success: true, tables: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error",
    });
  }
}
