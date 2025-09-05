"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Lightbulb, TrendingDown, TrendingUp, Target } from "lucide-react"

interface InsightData {
  biggestExpense?: { category: string; total: number }
  spendingComparison?: { current_month_spending: number; last_month_spending: number }
  savingsPace?: { goal_name: string; target_amount: number; current_amount: number; target_date: string }
}

export function SmartInsights() {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch("/api/insights")
        if (!response.ok) {
          throw new Error("Gagal memuat wawasan")
        }
        const data = await response.json()
        setInsights(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Wawasan Cerdas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
           <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
       <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Wawasan Cerdas
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <AlertTriangle className="h-8 w-8 mb-2"/>
                <p>{error}</p>
            </div>
        </CardContent>
       </Card>
    )
  }

  const { biggestExpense, spendingComparison, savingsPace } = insights || {}
  const spendingDiff = (spendingComparison?.current_month_spending || 0) - (spendingComparison?.last_month_spending || 0)

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Wawasan Cerdas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!biggestExpense && !spendingComparison && !savingsPace && (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada cukup data untuk menampilkan wawasan.</p>
        )}
        {biggestExpense && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="h-5 w-5 text-red-500"/>
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Pengeluaran Terbesar</p>
              <p className="text-xs text-muted-foreground">
                Bulan ini, pengeluaran terbesarmu ada di kategori <span className="font-bold text-red-600">{biggestExpense.category}</span> sebesar <span className="font-bold">Rp {Number(biggestExpense.total).toLocaleString("id-ID")}</span>.
              </p>
            </div>
          </div>
        )}

        {spendingComparison && spendingComparison.last_month_spending > 0 && (
           <div className="flex items-start gap-3">
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${spendingDiff > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {spendingDiff > 0 ? <TrendingUp className="h-5 w-5 text-red-500"/> : <TrendingDown className="h-5 w-5 text-green-500"/>}
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Tren Pengeluaran</p>
              <p className="text-xs text-muted-foreground">
                Pengeluaranmu {spendingDiff > 0 ? 'naik' : 'turun'} <span className={`font-bold ${spendingDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>Rp {Math.abs(spendingDiff).toLocaleString("id-ID")}</span> dibandingkan bulan lalu.
              </p>
            </div>
          </div>
        )}

        {savingsPace && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-blue-500"/>
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Progres Tabungan</p>
              <p className="text-xs text-muted-foreground">
                Kamu sedang menabung untuk <span className="font-bold text-blue-600">{savingsPace.goal_name}</span>. Terus semangat untuk mencapai targetmu!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
