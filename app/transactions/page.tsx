import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { TransactionsSummary } from "@/components/transactions/transactions-summary"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Transaction } from "@/lib/db"

async function getTransactions(userId: string) {
  const transactions = await sql`
    SELECT * FROM transactions 
    WHERE user_id = ${userId} 
    ORDER BY date DESC, created_at DESC
  `

  const summary = await sql`
    SELECT 
      COUNT(*) as total_transactions,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
      COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count,
      COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count
    FROM transactions 
    WHERE user_id = ${userId}
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
  `

  return {
    transactions: transactions as Transaction[],
    summary: summary[0],
  }
}

export default async function TransactionsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { transactions, summary } = await getTransactions(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transaksi Keuangan</h1>
              <p className="text-gray-600 mt-1">Catat semua pemasukan & pengeluaran biar nggak ada yang kelewat</p>
            </div>
            <Link href="/transactions/add">
              <Button className="glass-strong text-white hover:bg-white/20 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <TransactionsSummary summary={summary} />

          {/* Transactions List */}
          <TransactionsList transactions={transactions} />
        </div>
      </main>
    </div>
  )
}
