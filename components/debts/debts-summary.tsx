import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface DebtsSummaryProps {
  summary: {
    total_debts: number
    total_remaining: number
    unpaid_count: number
    paid_count: number
    overdue_count: number
  }
}

export function DebtsSummary({ summary }: DebtsSummaryProps) {
  const cards = [
    {
      title: "Total Hutang",
      value: `Rp ${Number(summary.total_remaining).toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "from-purple-500 to-indigo-500",
      count: `${summary.total_debts} hutang`,
    },
    {
      title: "Belum Lunas",
      value: summary.unpaid_count.toString(),
      icon: Clock,
      color: "from-orange-500 to-red-500",
      count: "hutang aktif",
    },
    {
      title: "Sudah Lunas",
      value: summary.paid_count.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      count: "hutang selesai",
    },
    {
      title: "Terlambat",
      value: summary.overdue_count.toString(),
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      count: "perlu perhatian",
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
                  <p className="text-xs text-gray-500">{card.count}</p>
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
