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

export function AddDebtForm() {
  const [formData, setFormData] = useState({
    creditor_name: "",
    amount: "",
    remaining_amount: "",
    description: "",
    due_date: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseIndonesianNumber(formData.amount),
          remaining_amount: parseIndonesianNumber(formData.remaining_amount || formData.amount),
        }),
      })

      if (response.ok) {
        router.push("/debts")
      } else {
        const data = await response.json()
        setError(data.error || "Gagal menambah hutang")
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
          <Label htmlFor="creditor_name">Nama Kreditor *</Label>
          <Input
            id="creditor_name"
            name="creditor_name"
            value={formData.creditor_name}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="Bank, teman, dll"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah Total Hutang *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="remaining_amount">Sisa Hutang</Label>
          <Input
            id="remaining_amount"
            name="remaining_amount"
            type="number"
            value={formData.remaining_amount}
            onChange={handleChange}
            className="glass border-white/30 focus:border-blue-300"
            placeholder="Kosongkan jika sama dengan total"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">Kosongkan jika belum ada pembayaran</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
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
          placeholder="Catatan tambahan tentang hutang ini..."
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
          {isLoading ? "Menyimpan..." : "Simpan Hutang"}
        </Button>
      </div>
    </form>
  )
}
