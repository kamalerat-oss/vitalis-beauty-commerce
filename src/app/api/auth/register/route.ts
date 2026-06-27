import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullname, email, password, phone } = await req.json();

    if (!fullname || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      }, { status: 400 });
    }

    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Email sudah terdaftar",
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows: result } = await pool.query(
      `INSERT INTO users (fullname, email, password, phone, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id`,
      [fullname, email, hashedPassword, phone || null]
    );

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      userId: result[0].id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Gagal registrasi",
    }, { status: 500 });
  }
}
