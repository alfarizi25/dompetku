import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] DELETE savings goal API called with ID:", params.id)

    const user = await getCurrentUser()
    console.log("[v0] Current user:", user ? `ID: ${user.id}` : "null")

    if (!user) {
      console.log("[v0] Unauthorized - no user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = Number.parseInt(params.id)
    console.log("[v0] Parsed goal ID:", goalId)

    // Check if goal belongs to user
    const goal = await sql`
      SELECT * FROM savings_goals WHERE id = ${goalId} AND user_id = ${user.id}
    `
    console.log("[v0] Found goal:", goal.length > 0 ? "Yes" : "No")

    if (goal.length === 0) {
      console.log("[v0] Savings goal not found or doesn't belong to user")
      return NextResponse.json({ error: "Target tabungan tidak ditemukan" }, { status: 404 })
    }

    await sql`
      DELETE FROM savings_goals WHERE id = ${goalId} AND user_id = ${user.id}
    `
    console.log("[v0] Savings goal deleted successfully")

    return NextResponse.json({ message: "Target tabungan berhasil dihapus" })
  } catch (error) {
    console.error("[v0] Error deleting savings goal:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
