import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Plus, Eye } from "lucide-react"
import type { Transaction } from "@/lib/db"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        {/* Membuat header menjadi responsif */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transaksi Terbaru
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Link href="/transactions/add">
              <Button size="sm" className="glass-strong text-white hover:bg-white/20 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="outline" size="sm" className="glass border-white/30 bg-transparent w-full sm:w-auto">
                Lihat Semua
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada transaksi</p>
            <Link href="/transactions/add">
              <Button className="glass-strong text-white hover:bg-white/20">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                // Membuat layout item menjadi stacking di mobile
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg glass hover:glass-strong transition-all duration-200 gap-3"
              >
                <div className="flex items-center gap-3 w-full">
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
                    <p className="font-medium text-gray-900 break-words">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                  <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}Rp {Number(transaction.amount).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
