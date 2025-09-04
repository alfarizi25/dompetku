import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const debtId = Number.parseInt(params.id)

    // Check if debt belongs to user
    const debt = await sql`
      SELECT * FROM debts WHERE id = ${debtId} AND user_id = ${user.id}
    `

    if (debt.length === 0) {
      return NextResponse.json({ error: "Hutang tidak ditemukan" }, { status: 404 })
    }

    const result = await sql`
      UPDATE debts 
      SET is_paid = true, remaining_amount = 0, updated_at = NOW()
      WHERE id = ${debtId} AND user_id = ${user.id}
      RETURNING *
    `

    return NextResponse.json({ message: "Hutang berhasil ditandai lunas", debt: result[0] })
  } catch (error) {
    console.error("Error marking debt as paid:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
