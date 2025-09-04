import { Card, CardContent } from "@/components/ui/card"
import { FileText, CreditCard, PiggyBank, Calendar } from "lucide-react"

interface ReportsOverviewProps {
  data: {
    transactions: {
      total_transactions: number
      total_income: number
      total_expenses: number
      earliest_date: string | null
      latest_date: string | null
    }
    debts: {
      total_debts: number
      total_debt_amount: number
      total_remaining: number
    }
    savings: {
      total_goals: number
      total_target: number
      total_saved: number
    }
  }
}

export function ReportsOverview({ data }: ReportsOverviewProps) {
  const cards = [
    {
      title: "Total Transaksi",
      value: data.transactions.total_transactions.toString(),
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      subtitle: `Rp ${(Number(data.transactions.total_income) + Number(data.transactions.total_expenses)).toLocaleString("id-ID")} total volume`,
    },
    {
      title: "Periode Data",
      value: data.transactions.earliest_date
        ? `${new Date(data.transactions.earliest_date).getFullYear()} - ${new Date(data.transactions.latest_date || "").getFullYear()}`
        : "Belum ada data",
      icon: Calendar,
      color: "from-purple-500 to-indigo-500",
      subtitle: data.transactions.earliest_date
        ? `${Math.ceil((new Date(data.transactions.latest_date || "").getTime() - new Date(data.transactions.earliest_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} bulan`
        : "",
    },
    {
      title: "Data Hutang",
      value: data.debts.total_debts.toString(),
      icon: CreditCard,
      color: "from-red-500 to-pink-500",
      subtitle: `Rp ${Number(data.debts.total_remaining).toLocaleString("id-ID")} sisa`,
    },
    {
      title: "Target Tabungan",
      value: data.savings.total_goals.toString(),
      icon: PiggyBank,
      color: "from-green-500 to-emerald-500",
      subtitle: `${data.savings.total_target > 0 ? ((Number(data.savings.total_saved) / Number(data.savings.total_target)) * 100).toFixed(1) : 0}% tercapai`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className="glass-card hover:glass-strong transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
