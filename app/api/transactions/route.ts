import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, amount, description, category, date } = await request.json()

    if (!type || !amount || !description || !category || !date) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Jenis transaksi tidak valid" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO transactions (user_id, type, amount, description, category, date)
      VALUES (${user.id}, ${type}, ${amount}, ${description}, ${category}, ${date})
      RETURNING *
    `

    return NextResponse.json({ message: "Transaksi berhasil ditambahkan", transaction: result[0] })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${user.id} 
      ORDER BY date DESC, created_at DESC
    `

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
