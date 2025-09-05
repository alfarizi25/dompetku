import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insight 1: Kategori pengeluaran terbesar bulan ini
    const biggestExpenseCategory = await sql`
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = ${user.id}
        AND type = 'expense'
        AND date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY category
      ORDER BY total DESC
      LIMIT 1;
    `

    // Insight 2: Perbandingan pengeluaran dengan bulan lalu
    const spendingComparison = await sql`
      WITH current_month AS (
        SELECT SUM(amount) as total
        FROM transactions
        WHERE user_id = ${user.id}
          AND type = 'expense'
          AND date >= DATE_TRUNC('month', CURRENT_DATE)
      ),
      last_month AS (
        SELECT SUM(amount) as total
        FROM transactions
        WHERE user_id = ${user.id}
          AND type = 'expense'
          AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND date < DATE_TRUNC('month', CURRENT_DATE)
      )
      SELECT
        COALESCE((SELECT total FROM current_month), 0) as current_month_spending,
        COALESCE((SELECT total FROM last_month), 0) as last_month_spending;
    `
    
    // Insight 3: Progres target tabungan
    const savingsPace = await sql`
      SELECT 
        goal_name,
        target_amount,
        current_amount,
        target_date
      FROM savings_goals
      WHERE user_id = ${user.id}
        AND current_amount < target_amount
        AND target_date IS NOT NULL
      ORDER BY target_date ASC
      LIMIT 1;
    `

    return NextResponse.json({
      biggestExpense: biggestExpenseCategory[0] || null,
      spendingComparison: spendingComparison[0] || null,
      savingsPace: savingsPace[0] || null,
    })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server saat mengambil wawasan" }, { status: 500 })
  }
}

