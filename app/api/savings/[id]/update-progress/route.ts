import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = Number.parseInt(params.id)
    const { amount, isAdd } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Jumlah harus lebih dari 0" }, { status: 400 })
    }

    // Check if goal belongs to user
    const goal = await sql`
      SELECT * FROM savings_goals WHERE id = ${goalId} AND user_id = ${user.id}
    `

    if (goal.length === 0) {
      return NextResponse.json({ error: "Target tabungan tidak ditemukan" }, { status: 404 })
    }

    const currentGoal = goal[0]
    const newAmount = isAdd
      ? Number(currentGoal.current_amount) + amount
      : Math.max(0, Number(currentGoal.current_amount) - amount)

    const result = await sql`
      UPDATE savings_goals 
      SET current_amount = ${newAmount}, updated_at = NOW()
      WHERE id = ${goalId} AND user_id = ${user.id}
      RETURNING *
    `

    return NextResponse.json({
      message: `Progress berhasil ${isAdd ? "ditambah" : "dikurangi"}`,
      goal: result[0],
    })
  } catch (error) {
    console.error("Error updating savings progress:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
