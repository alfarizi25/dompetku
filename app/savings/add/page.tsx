import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AddSavingsGoalForm } from "@/components/savings/add-savings-goal-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AddSavingsGoalPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <DashboardHeader user={user} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 animate-fade-in">
            <Link href="/savings">
              <Button variant="outline" size="sm" className="glass border-white/30 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Target Tabungan</h1>
              <p className="text-gray-600">Buat target tabungan baru untuk dicapai</p>
            </div>
          </div>

          {/* Form */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Informasi Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddSavingsGoalForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
