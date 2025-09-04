import { CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react"

interface TransactionsSummaryProps {
  summary: {
    total_transactions: number
    total_income: number
    total_expenses: number
    income_count: number
    expense_count: number
  }
}

export function TransactionsSummary({ summary }: TransactionsSummaryProps) {
  const balance = Number(summary.total_income) - Number(summary.total_expenses)

  const cards = [
    {
      title: "Total Pemasukan",
      value: `Rp ${Number(summary.total_income).toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      count: `${summary.income_count} transaksi`,
    },
    {
      title: "Total Pengeluaran",
      value: `Rp ${Number(summary.total_expenses).toLocaleString("id-ID")}`,
      icon: TrendingDown,
      color: "from-red-500 to-pink-500",
      count: `${summary.expense_count} transaksi`,
    },
    {
      title: "Saldo Bulan Ini",
      value: `Rp ${Math.abs(balance).toLocaleString("id-ID")}`,
      icon: Wallet,
      color: balance >= 0 ? "from-blue-500 to-cyan-500" : "from-orange-500 to-red-500",
      count: balance >= 0 ? "Surplus" : "Defisit",
    },
    {
      title: "Total Transaksi",
      value: summary.total_transactions.toString(),
      icon: BarChart3,
      color: "from-purple-500 to-indigo-500",
      count: "bulan ini",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="glass-card hover:glass-strong transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.count}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </div>
        )
      })}
    </div>
  )
}
