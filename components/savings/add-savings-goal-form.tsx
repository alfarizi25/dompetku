"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseIndonesianNumber } from "@/lib/utils"

export function AddSavingsGoalForm() {
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
    target_date: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          target_amount: parseIndonesianNumber(formData.target_amount),
          current_amount: parseIndonesianNumber(formData.current_amount || "0"),
        }),
      })

      if (response.ok) {
        router.push("/savings")
      } else {
        const data = await response.json()
        setError(data.error || "Gagal menambah target tabungan")
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="glass border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="goal_name">Nama Target *</Label>
          <Input
            id="goal_name"
            name="goal_name"
            value={formData.goal_name}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="Liburan, Gadget, dll"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_amount">Jumlah Target *</Label>
          <Input
            id="target_amount"
            name="target_amount"
            type="number"
            value={formData.target_amount}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_amount">Jumlah Saat Ini</Label>
          <Input
            id="current_amount"
            name="current_amount"
            type="number"
            value={formData.current_amount}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="0"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">Kosongkan jika mulai dari 0</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_date">Tanggal Target</Label>
          <Input
            id="target_date"
            name="target_date"
            type="date"
            value={formData.target_date}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="glass border-white/30 focus:border-blue-300"
          placeholder="Catatan tentang target tabungan ini..."
          rows={3}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="glass border-white/30 bg-transparent"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="glass-strong text-white hover:bg-white/20 transition-all duration-300"
        >
          {isLoading ? "Menyimpan..." : "Simpan Target"}
        </Button>
      </div>
    </form>
  )
}
