"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, PieChartIcon, BarChart3 } from "lucide-react"

interface TransactionChartsProps {
  monthlyData: Array<{
    month: string
    income: number
    expense: number
    balance: number
  }>
  categoryData: Array<{
    category: string
    amount: number
    count: number
  }>
  stats: {
    total_income: number
    total_expenses: number
  }
}

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"]

export function TransactionCharts({ monthlyData, categoryData, stats }: TransactionChartsProps) {
  const totalIncome = Number(stats.total_income)
  const totalExpenses = Number(stats.total_expenses)

  // Prepare pie chart data for income vs expenses
  const incomeExpenseData = [
    { name: "Pemasukan", value: totalIncome, color: "#10B981" },
    { name: "Pengeluaran", value: totalExpenses, color: "#EF4444" },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "income" && "Pemasukan: "}
              {entry.dataKey === "expense" && "Pengeluaran: "}
              {entry.dataKey === "balance" && "Saldo: "}
              {entry.dataKey === "amount" && "Jumlah: "}
              Rp {Number(entry.value).toLocaleString("id-ID")}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card p-3 border border-white/20 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p>Jumlah: Rp {Number(data.amount).toLocaleString("id-ID")}</p>
          <p>Transaksi: {data.count}x</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend Chart */}
      <Card className="glass-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Tren Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#6B7280" fontSize={10} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: "#10B981", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: "#EF4444", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Pemasukan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Pengeluaran</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>Saldo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income vs Expenses Pie Chart */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Perbandingan Bulan Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={incomeExpenseData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {incomeExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, ""]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 mt-4 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Pemasukan</span>
              <span className="font-medium">Rp {totalIncome.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Pengeluaran</span>
              <span className="font-medium">Rp {totalExpenses.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown Chart */}
      <Card className="glass-card animate-slide-up lg:col-span-2" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Pengeluaran per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="category"
                stroke="#6B7280"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis stroke="#6B7280" fontSize={10} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CategoryTooltip />} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
