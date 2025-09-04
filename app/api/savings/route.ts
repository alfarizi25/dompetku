import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { goal_name, target_amount, current_amount, target_date, description } = await request.json()

    if (!goal_name || !target_amount) {
      return NextResponse.json({ error: "Nama target dan jumlah target harus diisi" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, target_date, description)
      VALUES (${user.id}, ${goal_name}, ${target_amount}, ${current_amount || 0}, ${target_date || null}, ${description || null})
      RETURNING *
    `

    return NextResponse.json({ message: "Target tabungan berhasil ditambahkan", goal: result[0] })
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goals = await sql`
      SELECT * FROM savings_goals 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
