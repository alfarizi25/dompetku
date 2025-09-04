"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { parseIndonesianNumber } from "@/lib/utils"

const categories = {
  income: ["Gaji", "Freelance", "Investasi", "Bonus", "Hadiah", "Lainnya"],
  expense: ["Makanan", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Pendidikan", "Lainnya"],
}

export function AddTransactionForm() {
  const searchParams = useSearchParams()
  const defaultType = (searchParams.get("type") as "income" | "expense") || "expense"

  const [formData, setFormData] = useState({
    type: defaultType,
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseIndonesianNumber(formData.amount),
        }),
      })

      if (response.ok) {
        router.push("/transactions")
      } else {
        const data = await response.json()
        setError(data.error || "Gagal menambah transaksi")
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === "type" && { category: "" }),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="glass border-red-200 animate-bounce-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Jenis Transaksi *</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger className="glass border-white/30 focus:border-blue-300 focus-ring">
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="income">Pemasukan</SelectItem>
              <SelectItem value="expense">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah *</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="glass border-white/30 focus:border-blue-300 focus-ring"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="glass border-white/30 focus:border-blue-300 focus-ring">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              {categories[formData.type as keyof typeof categories].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Tanggal *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="glass border-white/30 focus:border-blue-300 focus-ring"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="glass border-white/30 focus:border-blue-300 focus-ring"
          placeholder="Deskripsi transaksi..."
          rows={3}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="glass border-white/30 bg-transparent hover-lift focus-ring order-2 sm:order-1"
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="glass-strong text-white hover:bg-white/20 transition-all duration-300 button-press focus-ring order-1 sm:order-2 flex-1 sm:flex-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan Transaksi"
          )}
        </Button>
      </div>
    </form>
  )
}
