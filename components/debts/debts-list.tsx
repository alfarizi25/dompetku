"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Trash2, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Debt } from "@/lib/db"

interface DebtsListProps {
  debts: Debt[]
}

export function DebtsList({ debts }: DebtsListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const router = useRouter()

  const handleMarkAsPaid = async (debtId: number) => {
    setIsLoading(debtId)
    try {
      const response = await fetch(`/api/debts/${debtId}/mark-paid`, {
        method: "PATCH",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error marking debt as paid:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (debtId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus hutang ini?")) return

    console.log("[v0] Attempting to delete debt:", debtId)
    setIsLoading(debtId)
    try {
      const response = await fetch(`/api/debts/${debtId}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)
      console.log("[v0] Delete response ok:", response.ok)

      if (response.ok) {
        console.log("[v0] Debt deleted successfully, refreshing...")
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error("[v0] Delete failed:", errorData)
        alert(`Gagal menghapus hutang: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error deleting debt:", error)
      alert("Terjadi kesalahan saat menghapus hutang")
    } finally {
      setIsLoading(null)
    }
  }

  const getStatusBadge = (debt: Debt) => {
    if (debt.is_paid) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Lunas</Badge>
    }

    if (debt.due_date && new Date(debt.due_date) < new Date()) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Terlambat</Badge>
    }

    return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Belum Lunas</Badge>
  }

  const getStatusIcon = (debt: Debt) => {
    if (debt.is_paid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    if (debt.due_date && new Date(debt.due_date) < new Date()) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }

    return <Clock className="h-5 w-5 text-orange-500" />
  }

  if (debts.length === 0) {
    return (
      <Card className="glass-card animate-slide-up">
        <CardContent className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada hutang</h3>
          <p className="text-gray-600 mb-6">Mulai catat hutang Anda untuk melacak kewajiban finansial</p>
          <Button className="glass-strong text-white hover:bg-white/20">Tambah Hutang Pertama</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle>Daftar Hutang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className={`p-4 rounded-lg glass hover:glass-strong transition-all duration-200 ${
                debt.is_paid ? "opacity-75" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1 flex-shrink-0">{getStatusIcon(debt)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{debt.creditor_name}</h3>
                      {getStatusBadge(debt)}
                    </div>
                    {debt.description && <p className="text-sm text-gray-600 mb-2 break-words">{debt.description}</p>}
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span>
                        Sisa:{" "}
                        <span className="font-medium">Rp {Number(debt.remaining_amount).toLocaleString("id-ID")}</span>
                      </span>
                      <span>
                        Total: <span className="font-medium">Rp {Number(debt.amount).toLocaleString("id-ID")}</span>
                      </span>
                      {debt.due_date && <span>Jatuh tempo: {new Date(debt.due_date).toLocaleDateString("id-ID")}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end sm:ml-4">
                  {!debt.is_paid && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(debt.id)}
                      disabled={isLoading === debt.id}
                      className="glass-strong text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      {isLoading === debt.id ? "..." : "Tandai Lunas"}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(debt.id)}
                    disabled={isLoading === debt.id}
                    className="h-8 w-8 p-0 flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Hapus hutang"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
