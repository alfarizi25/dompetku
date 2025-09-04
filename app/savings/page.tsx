import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SavingsGoalsList } from "@/components/savings/savings-goals-list"
import { SavingsSummary } from "@/components/savings/savings-summary"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { SavingsGoal } from "@/lib/db"

async function getSavingsGoals(userId: string) {
  const goals = await sql`
    SELECT * FROM savings_goals 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `

  const summary = await sql`
    SELECT 
      COUNT(*) as total_goals,
      COALESCE(SUM(target_amount), 0) as total_target,
      COALESCE(SUM(current_amount), 0) as total_saved,
      COUNT(CASE WHEN current_amount >= target_amount THEN 1 END) as completed_goals,
      COUNT(CASE WHEN target_date < CURRENT_DATE AND current_amount < target_amount THEN 1 END) as overdue_goals
    FROM savings_goals 
    WHERE user_id = ${userId}
  `

  return {
    goals: goals as SavingsGoal[],
    summary: summary[0],
  }
}

export default async function SavingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { goals, summary } = await getSavingsGoals(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Rencana Tabungan</h1>
              <p className="text-gray-600 mt-1">Bikin target nabung, pantau progresnya, dan lihat tabungan makin gede</p>
            </div>
            <Link href="/savings/add">
              <Button className="glass-strong text-white hover:bg-white/20 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Target
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <SavingsSummary summary={summary} />

          {/* Goals List */}
          <SavingsGoalsList goals={goals} />
        </div>
      </main>
    </div>
  )
}
