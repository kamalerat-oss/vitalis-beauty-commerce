import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });
    const { rows } = await pool.query(
      "SELECT id, fullname, email, phone, role, created_at FROM users WHERE id = $1",
      [userId]
    );
    if (rows.length === 0) return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal mengambil profil" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, fullname, phone, currentPassword, newPassword } = await req.json();
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    const user = rows[0];

    let hashedPassword = user.password;
    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ success: false, message: "Password lama wajib diisi" }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return NextResponse.json({ success: false, message: "Password lama salah" }, { status: 401 });
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const { rows: updated } = await pool.query(
      "UPDATE users SET fullname = $1, phone = $2, password = $3 WHERE id = $4 RETURNING id, fullname, email, phone, role",
      [fullname || user.fullname, phone || user.phone, hashedPassword, userId]
    );
    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update profil" }, { status: 500 });
  }
}
