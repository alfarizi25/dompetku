import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, FileText, Zap } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Tambah Pemasukan",
      description: "Catat pemasukan baru",
      href: "/transactions/add?type=income",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Tambah Pengeluaran",
      description: "Catat pengeluaran baru",
      href: "/transactions/add?type=expense",
      icon: TrendingDown,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Catat Hutang",
      description: "Tambah hutang baru",
      href: "/debts/add",
      icon: CreditCard,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Target Tabungan",
      description: "Buat target tabungan",
      href: "/savings/add",
      icon: PiggyBank,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Lihat Laporan",
      description: "Export data keuangan",
      href: "/reports",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
  ]

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-4 glass hover:glass-strong transition-all duration-200"
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
