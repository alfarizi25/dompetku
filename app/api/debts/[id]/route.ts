import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] DELETE debt API called with ID:", params.id)

    const user = await getCurrentUser()
    console.log("[v0] Current user:", user ? `ID: ${user.id}` : "null")

    if (!user) {
      console.log("[v0] Unauthorized - no user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const debtId = Number.parseInt(params.id)
    console.log("[v0] Parsed debt ID:", debtId)

    // Check if debt belongs to user
    const debt = await sql`
      SELECT * FROM debts WHERE id = ${debtId} AND user_id = ${user.id}
    `
    console.log("[v0] Found debt:", debt.length > 0 ? "Yes" : "No")

    if (debt.length === 0) {
      console.log("[v0] Debt not found or doesn't belong to user")
      return NextResponse.json({ error: "Hutang tidak ditemukan" }, { status: 404 })
    }

    await sql`
      DELETE FROM debts WHERE id = ${debtId} AND user_id = ${user.id}
    `
    console.log("[v0] Debt deleted successfully")

    return NextResponse.json({ message: "Hutang berhasil dihapus" })
  } catch (error) {
    console.error("[v0] Error deleting debt:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
