import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Target } from "lucide-react"

interface StatsCardsProps {
  stats: {
    total_income: number
    total_expenses: number
    income_count: number
    expense_count: number
  }
  debts: {
    total_debts: number
    total_debt_amount: number
    unpaid_debts: number
  }
  savings: {
    total_goals: number
    total_target: number
    total_saved: number
  }
}

export function StatsCards({ stats, debts, savings }: StatsCardsProps) {
  const balance = Number(stats.total_income) - Number(stats.total_expenses)
  const savingsProgress =
    Number(savings.total_target) > 0 ? (Number(savings.total_saved) / Number(savings.total_target)) * 100 : 0

  const cards = [
    {
      title: "Pemasukan Bulan Ini",
      value: `Rp ${Number(stats.total_income).toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      count: `${stats.income_count} transaksi`,
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: `Rp ${Number(stats.total_expenses).toLocaleString("id-ID")}`,
      icon: TrendingDown,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      count: `${stats.expense_count} transaksi`,
    },
    {
      title: "Saldo",
      value: `Rp ${balance.toLocaleString("id-ID")}`,
      icon: Wallet,
      color: balance >= 0 ? "from-blue-500 to-cyan-500" : "from-orange-500 to-red-500",
      bgColor: balance >= 0 ? "bg-blue-50" : "bg-orange-50",
      count: balance >= 0 ? "Surplus" : "Defisit",
    },
    {
      title: "Total Hutang",
      value: `Rp ${Number(debts.total_debt_amount).toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      count: `${debts.unpaid_debts} belum lunas`,
    },
    {
      title: "Progress Tabungan",
      value: `${savingsProgress.toFixed(1)}%`,
      icon: PiggyBank,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      count: `${savings.total_goals} target`,
    },
    {
      title: "Target Tabungan",
      value: `Rp ${Number(savings.total_target).toLocaleString("id-ID")}`,
      icon: Target,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      count: `Rp ${Number(savings.total_saved).toLocaleString("id-ID")} terkumpul`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className="glass-card hover:glass-strong transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1 truncate">{card.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{card.value}</p>
                  <p className="text-xs text-gray-500 truncate">{card.count}</p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
