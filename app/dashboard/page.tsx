import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { Transaction } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FinancialOverview } from "@/components/dashboard/financial-overview"
import { TransactionCharts } from "@/components/dashboard/transaction-charts"
import { SmartInsights } from "@/components/dashboard/smart-insights"

// Define interfaces for the data shapes
interface StatsData {
  total_income: number;
  total_expenses: number;
  income_count: number;
  expense_count: number;
}

interface DebtsData {
  total_debts: number;
  total_debt_amount: number;
  unpaid_debts: number;
}

interface SavingsData {
    total_goals: number;
    total_target: number;
    total_saved: number;
}

interface MonthlyData {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

interface CategoryData {
    category: string;
    amount: number;
    count: number;
}

interface DashboardData {
  transactions: Transaction[];
  stats: StatsData;
  debts: DebtsData;
  savings: SavingsData;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
}


async function getDashboardData(userId: string): Promise<DashboardData> {
  // Get recent transactions
  const transactions = await sql`
    SELECT * FROM transactions 
    WHERE user_id = ${userId} 
    ORDER BY date DESC, created_at DESC 
    LIMIT 5
  `

  // Get financial stats
  const stats = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
      COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count,
      COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count
    FROM transactions 
    WHERE user_id = ${userId}
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
  `

  // Get debt summary
  const debts = await sql`
    SELECT 
      COUNT(*) as total_debts,
      COALESCE(SUM(remaining_amount), 0) as total_debt_amount,
      COUNT(CASE WHEN is_paid = false THEN 1 END) as unpaid_debts
    FROM debts 
    WHERE user_id = ${userId}
  `

  // Get savings goals summary
  const savings = await sql`
    SELECT 
      COUNT(*) as total_goals,
      COALESCE(SUM(target_amount), 0) as total_target,
      COALESCE(SUM(current_amount), 0) as total_saved
    FROM savings_goals 
    WHERE user_id = ${userId}
  `

  const monthlyData = await sql`
    SELECT 
      TO_CHAR(date, 'Mon YYYY') as month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
    FROM transactions 
    WHERE user_id = ${userId}
      AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
    GROUP BY TO_CHAR(date, 'Mon YYYY'), DATE_TRUNC('month', date)
    ORDER BY DATE_TRUNC('month', date)
  `

  const categoryData = await sql`
    SELECT 
      category,
      COALESCE(SUM(amount), 0) as amount,
      COUNT(*) as count
    FROM transactions 
    WHERE user_id = ${userId}
      AND type = 'expense'
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY category
    ORDER BY amount DESC
    LIMIT 8
  `

  return {
    transactions: transactions as Transaction[],
    stats: stats[0] as StatsData,
    debts: debts[0] as DebtsData,
    savings: savings[0] as SavingsData,
    monthlyData: monthlyData as MonthlyData[],
    categoryData: categoryData as CategoryData[],
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const data = await getDashboardData(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Selamat datang, {user.name}!</h1>
            <p className="text-gray-600">Cuan masuk, keluar, semua udah kita catetin. Nih hasilnya bulan ini</p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={data.stats} debts={data.debts} savings={data.savings} />

          <TransactionCharts monthlyData={data.monthlyData} categoryData={data.categoryData} stats={data.stats} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Overview & Recent Transactions */}
            <div className="lg:col-span-2 space-y-8">
              <FinancialOverview stats={data.stats} />
              <RecentTransactions transactions={data.transactions} />
            </div>

            {/* Right Column - Smart Insights & Quick Actions */}
            <div className="lg:col-span-1 space-y-8">
              <SmartInsights />
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

