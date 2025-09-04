import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AddTransactionForm } from "@/components/transactions/add-transaction-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AddTransactionPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in">
            <Link href="/transactions">
              <Button
                variant="outline"
                size="sm"
                className="glass border-white/30 bg-transparent hover-lift focus-ring"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tambah Transaksi</h1>
              <p className="text-gray-600 text-sm sm:text-base">Catat pemasukan atau pengeluaran baru</p>
            </div>
          </div>

          {/* Form */}
          <Card className="glass-card animate-slide-up hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Informasi Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddTransactionForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
