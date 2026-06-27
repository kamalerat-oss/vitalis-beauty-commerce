import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Email atau password salah",
      }, { status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({
        success: false,
        message: "Email atau password salah",
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.email_verified === 1,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Gagal login",
    }, { status: 500 });
  }
}
