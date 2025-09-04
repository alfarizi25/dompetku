import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] DELETE transaction API called with ID:", params.id)

    const user = await getCurrentUser()
    console.log("[v0] Current user:", user ? `ID: ${user.id}` : "null")

    if (!user) {
      console.log("[v0] Unauthorized - no user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactionId = Number.parseInt(params.id)
    console.log("[v0] Parsed transaction ID:", transactionId)

    // Check if transaction belongs to user
    const transaction = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId} AND user_id = ${user.id}
    `
    console.log("[v0] Found transaction:", transaction.length > 0 ? "Yes" : "No")

    if (transaction.length === 0) {
      console.log("[v0] Transaction not found or doesn't belong to user")
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 })
    }

    await sql`
      DELETE FROM transactions WHERE id = ${transactionId} AND user_id = ${user.id}
    `
    console.log("[v0] Transaction deleted successfully")

    return NextResponse.json({ message: "Transaksi berhasil dihapus" })
  } catch (error) {
    console.error("[v0] Error deleting transaction:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
