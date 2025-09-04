"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface FinancialOverviewProps {
  stats: {
    total_income: number
    total_expenses: number
    income_count: number
    expense_count: number
  }
}

export function FinancialOverview({ stats }: FinancialOverviewProps) {
  const totalIncome = Number(stats.total_income)
  const totalExpenses = Number(stats.total_expenses)
  const balance = totalIncome - totalExpenses
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Ringkasan Keuangan Bulan Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Income vs Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Pemasukan</span>
              </div>
              <span className="text-sm font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</span>
            </div>
            <Progress value={100} className="h-2 bg-green-100" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Pengeluaran</span>
              </div>
              <span className="text-sm font-bold text-red-600">Rp {totalExpenses.toLocaleString("id-ID")}</span>
            </div>
            <Progress value={expenseRatio} className="h-2 bg-red-100" />
            <p className="text-xs text-gray-500">{expenseRatio.toFixed(1)}% dari pemasukan</p>
          </div>
        </div>

        {/* Balance Summary */}
        <div
          className={`p-4 rounded-lg ${balance >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Bulan Ini</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                Rp {Math.abs(balance).toLocaleString("id-ID")}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${balance >= 0 ? "bg-green-500" : "bg-red-500"}`}
            >
              {balance >= 0 ? (
                <TrendingUp className="h-6 w-6 text-white" />
              ) : (
                <TrendingDown className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {balance >= 0 ? "Surplus" : "Defisit"} - {balance >= 0 ? "Keuangan sehat!" : "Perlu perhatian"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.income_count}</p>
            <p className="text-sm text-gray-600">Transaksi Masuk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.expense_count}</p>
            <p className="text-sm text-gray-600">Transaksi Keluar</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
