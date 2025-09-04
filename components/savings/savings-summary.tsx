import { Card, CardContent } from "@/components/ui/card"
import { Target, PiggyBank, CheckCircle, AlertTriangle } from "lucide-react"

interface SavingsSummaryProps {
  summary: {
    total_goals: number
    total_target: number
    total_saved: number
    completed_goals: number
    overdue_goals: number
  }
}

export function SavingsSummary({ summary }: SavingsSummaryProps) {
  const progressPercentage =
    Number(summary.total_target) > 0 ? (Number(summary.total_saved) / Number(summary.total_target)) * 100 : 0

  const cards = [
    {
      title: "Total Target",
      value: `Rp ${Number(summary.total_target).toLocaleString("id-ID")}`,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      count: `${summary.total_goals} target`,
    },
    {
      title: "Total Terkumpul",
      value: `Rp ${Number(summary.total_saved).toLocaleString("id-ID")}`,
      icon: PiggyBank,
      color: "from-green-500 to-emerald-500",
      count: `${progressPercentage.toFixed(1)}% tercapai`,
    },
    {
      title: "Target Selesai",
      value: summary.completed_goals.toString(),
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      count: "target tercapai",
    },
    {
      title: "Terlambat",
      value: summary.overdue_goals.toString(),
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
