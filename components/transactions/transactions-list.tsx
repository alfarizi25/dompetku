"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Trash2, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/lib/db"

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const router = useRouter()

  const handleDelete = async (transactionId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return

    console.log("[v0] Attempting to delete transaction:", transactionId)
    setIsLoading(transactionId)
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)
      console.log("[v0] Delete response ok:", response.ok)

      if (response.ok) {
        console.log("[v0] Transaction deleted successfully, refreshing...")
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error("[v0] Delete failed:", errorData)
        alert(`Gagal menghapus transaksi: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error deleting transaction:", error)
      alert("Terjadi kesalahan saat menghapus transaksi")
    } finally {
      setIsLoading(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <Card className="glass-card animate-slide-up">
        <CardContent className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada transaksi</h3>
          <p className="text-gray-600 mb-6">Mulai catat pemasukan dan pengeluaran Anda</p>
          <Button className="glass-strong text-white hover:bg-white/20">Tambah Transaksi Pertama</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg glass hover:glass-strong transition-all duration-200 gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{transaction.description}</h3>
                    <Badge variant="secondary" className="text-xs w-fit">
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString("id-ID")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-left sm:text-right">
                  <p
                    className={`font-bold text-sm sm:text-base ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}Rp {Number(transaction.amount).toLocaleString("id-ID")}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={isLoading === transaction.id}
                  className="h-8 w-8 p-0 flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Hapus transaksi"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
