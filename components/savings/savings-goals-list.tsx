"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, CheckCircle, AlertTriangle, Plus, Minus, Trash2, PiggyBank } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import type { SavingsGoal } from "@/lib/db"
import { parseIndonesianNumber } from "@/lib/utils"

interface SavingsGoalsListProps {
  goals: SavingsGoal[]
}

export function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [updateAmount, setUpdateAmount] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const router = useRouter()

  const handleUpdateProgress = async (goalId: number, amount: number, isAdd: boolean) => {
    setIsLoading(goalId)
    try {
      const response = await fetch(`/api/savings/${goalId}/update-progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, isAdd }),
      })

      if (response.ok) {
        router.refresh()
        setSelectedGoal(null)
        setUpdateAmount("")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (goalId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus target tabungan ini?")) return

    console.log("[v0] Attempting to delete savings goal:", goalId)
    setIsLoading(goalId)
    try {
      const response = await fetch(`/api/savings/${goalId}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)
      console.log("[v0] Delete response ok:", response.ok)

      if (response.ok) {
        console.log("[v0] Savings goal deleted successfully, refreshing...")
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error("[v0] Delete failed:", errorData)
        alert(`Gagal menghapus target tabungan: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error deleting savings goal:", error)
      alert("Terjadi kesalahan saat menghapus target tabungan")
    } finally {
      setIsLoading(null)
    }
  }

  const getStatusBadge = (goal: SavingsGoal) => {
    const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100

    if (progress >= 100) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Tercapai</Badge>
    }

    if (goal.target_date && new Date(goal.target_date) < new Date() && progress < 100) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Terlambat</Badge>
    }

    if (progress >= 75) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Hampir Tercapai</Badge>
    }

    return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Dalam Progress</Badge>
  }

  const getStatusIcon = (goal: SavingsGoal) => {
    const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100

    if (progress >= 100) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    if (goal.target_date && new Date(goal.target_date) < new Date() && progress < 100) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }

    return <Target className="h-5 w-5 text-blue-500" />
  }

  if (goals.length === 0) {
    return (
      <Card className="glass-card animate-slide-up">
        <CardContent className="text-center py-12">
          <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada target tabungan</h3>
          <p className="text-gray-600 mb-6">Mulai buat target tabungan untuk mencapai tujuan finansial Anda</p>
          <Button className="glass-strong text-white hover:bg-white/20">Buat Target Pertama</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <CardTitle>Target Tabungan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
            const isCompleted = progress >= 100

            return (
              <div
                key={goal.id}
                className={`p-6 rounded-lg glass hover:glass-strong transition-all duration-200 ${
                  isCompleted ? "bg-green-50/50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getStatusIcon(goal)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{goal.goal_name}</h3>
                        {getStatusBadge(goal)}
                      </div>
                      {goal.description && <p className="text-sm text-gray-600 mb-2">{goal.description}</p>}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                        <span>
                          Target:{" "}
                          <span className="font-medium">Rp {Number(goal.target_amount).toLocaleString("id-ID")}</span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          Terkumpul:{" "}
                          <span className="font-medium">Rp {Number(goal.current_amount).toLocaleString("id-ID")}</span>
                        </span>
                        {goal.target_date && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>Target: {new Date(goal.target_date).toLocaleDateString("id-ID")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(goal.id)}
                    disabled={isLoading === goal.id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Hapus target tabungan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-3" />
                </div>

                {/* Action Buttons */}
                {!isCompleted && (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedGoal(goal)}
                          className="glass-strong text-white hover:bg-white/20"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Tambah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/20">
                        <DialogHeader>
                          <DialogTitle>Update Progress - {goal.goal_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Jumlah</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={updateAmount}
                              onChange={(e) => setUpdateAmount(e.target.value)}
                              className="glass border-white/30 focus:border-blue-300"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleUpdateProgress(goal.id, parseIndonesianNumber(updateAmount) || 0, true)
                              }
                              disabled={!updateAmount || isLoading === goal.id}
                              className="flex-1 glass-strong text-white hover:bg-white/20"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah
                            </Button>
                            <Button
                              onClick={() =>
                                handleUpdateProgress(goal.id, parseIndonesianNumber(updateAmount) || 0, false)
                              }
                              disabled={!updateAmount || isLoading === goal.id}
                              variant="outline"
                              className="flex-1 glass border-white/30 bg-transparent"
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              Kurangi
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
