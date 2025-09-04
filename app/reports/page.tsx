import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExportSection } from "@/components/reports/export-section"
import { ReportsOverview } from "@/components/reports/reports-overview"

async function getReportsData(userId: string) {
  // Get summary statistics
  const transactionStats = await sql`
    SELECT 
      COUNT(*) as total_transactions,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
      MIN(date) as earliest_date,
      MAX(date) as latest_date
    FROM transactions 
    WHERE user_id = ${userId}
  `

  const debtStats = await sql`
    SELECT 
      COUNT(*) as total_debts,
      COALESCE(SUM(amount), 0) as total_debt_amount,
      COALESCE(SUM(remaining_amount), 0) as total_remaining
    FROM debts 
    WHERE user_id = ${userId}
  `

  const savingsStats = await sql`
    SELECT 
      COUNT(*) as total_goals,
      COALESCE(SUM(target_amount), 0) as total_target,
      COALESCE(SUM(current_amount), 0) as total_saved
    FROM savings_goals 
    WHERE user_id = ${userId}
  `

  return {
    transactions: transactionStats[0],
    debts: debtStats[0],
    savings: savingsStats[0],
  }
}

export default async function ReportsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const data = await getReportsData(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Laporan & Export</h1>
            <p className="text-gray-600 mt-1">Butuh laporan rapi? Export ke Excel sekali klik</p>
          </div>

          {/* Overview */}
          <ReportsOverview data={data} />

          {/* Export Section */}
          <ExportSection />
        </div>
      </main>
    </div>
  )
}
