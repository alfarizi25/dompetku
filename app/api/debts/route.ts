import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { creditor_name, amount, remaining_amount, description, due_date } = await request.json()

    if (!creditor_name || !amount) {
      return NextResponse.json({ error: "Nama kreditor dan jumlah harus diisi" }, { status: 400 })
    }

    const finalRemainingAmount = remaining_amount || amount

    const result = await sql`
      INSERT INTO debts (user_id, creditor_name, amount, remaining_amount, description, due_date)
      VALUES (${user.id}, ${creditor_name}, ${amount}, ${finalRemainingAmount}, ${description || null}, ${due_date || null})
      RETURNING *
    `

    return NextResponse.json({ message: "Hutang berhasil ditambahkan", debt: result[0] })
  } catch (error) {
    console.error("Error creating debt:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const debts = await sql`
      SELECT * FROM debts 
      WHERE user_id = ${user.id} 
      ORDER BY is_paid ASC, due_date ASC NULLS LAST, created_at DESC
    `

    return NextResponse.json({ debts })
  } catch (error) {
    console.error("Error fetching debts:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
