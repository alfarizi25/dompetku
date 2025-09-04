import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DebtsList } from "@/components/debts/debts-list"
import { DebtsSummary } from "@/components/debts/debts-summary"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Debt } from "@/lib/db"

async function getDebts(userId: string) {
  const debts = await sql`
    SELECT * FROM debts 
    WHERE user_id = ${userId} 
    ORDER BY is_paid ASC, due_date ASC NULLS LAST, created_at DESC
  `

  const summary = await sql`
    SELECT 
      COUNT(*) as total_debts,
      COALESCE(SUM(remaining_amount), 0) as total_remaining,
      COUNT(CASE WHEN is_paid = false THEN 1 END) as unpaid_count,
      COUNT(CASE WHEN is_paid = true THEN 1 END) as paid_count,
      COUNT(CASE WHEN due_date < CURRENT_DATE AND is_paid = false THEN 1 END) as overdue_count
    FROM debts 
    WHERE user_id = ${userId}
  `

  return {
    debts: debts as Debt[],
    summary: summary[0],
  }
}

export default async function DebtsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { debts, summary } = await getDebts(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manajemen Hutang</h1>
              <p className="text-gray-600 mt-1">Pantau hutang dengan gampang, biar cepat lunas tanpa ribet</p>
            </div>
            <Link href="/debts/add">
              <Button className="glass-strong text-white hover:bg-white/20 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Hutang
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <DebtsSummary summary={summary} />

          {/* Debts List */}
          <DebtsList debts={debts} />
        </div>
      </main>
    </div>
  )
}
