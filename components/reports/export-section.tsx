"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileSpreadsheet, Calendar, Filter } from "lucide-react"

export function ExportSection() {
  const [exportOptions, setExportOptions] = useState({
    transactions: true,
    debts: true,
    savings: true,
  })
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState("")

  const handleExport = async () => {
    if (!exportOptions.transactions && !exportOptions.debts && !exportOptions.savings) {
      setMessage("Pilih minimal satu jenis data untuk di-export")
      return
    }

    setIsExporting(true)
    setMessage("")

    try {
      const params = new URLSearchParams({
        transactions: exportOptions.transactions.toString(),
        debts: exportOptions.debts.toString(),
        savings: exportOptions.savings.toString(),
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })

      const response = await fetch(`/api/export/excel?${params}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `financial-report-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setMessage("Export berhasil! File telah diunduh.")
      } else {
        const data = await response.json()
        setMessage(data.error || "Gagal melakukan export")
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat export")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Export Options */}
      <Card className="glass-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Pilihan Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Pilih Data yang Akan Di-export</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transactions"
                  checked={exportOptions.transactions}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({ ...prev, transactions: checked as boolean }))
                  }
                />
                <Label htmlFor="transactions" className="text-sm font-normal">
                  Data Transaksi (Pemasukan & Pengeluaran)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="debts"
                  checked={exportOptions.debts}
                  onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, debts: checked as boolean }))}
                />
                <Label htmlFor="debts" className="text-sm font-normal">
                  Data Hutang
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="savings"
                  checked={exportOptions.savings}
                  onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, savings: checked as boolean }))}
                />
                <Label htmlFor="savings" className="text-sm font-normal">
                  Data Target Tabungan
                </Label>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Filter Tanggal (Opsional)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm">
                  Dari Tanggal
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="glass border-white/30 focus:border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm">
                  Sampai Tanggal
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="glass border-white/30 focus:border-blue-300"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Kosongkan untuk export semua data</p>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full glass-strong text-white hover:bg-white/20 transition-all duration-300"
          >
            {isExporting ? (
              "Memproses Export..."
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export ke Excel
              </>
            )}
          </Button>

          {/* Message */}
          {message && (
            <Alert
              className={`glass border-white/20 ${message.includes("berhasil") ? "border-green-200" : "border-red-200"}`}
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Export Info */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Informasi Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 glass rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Format File Excel</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• File akan berformat .xlsx</li>
                <li>• Setiap jenis data akan memiliki sheet terpisah</li>
                <li>• Header kolom akan diformat dengan warna</li>
                <li>• Data akan diurutkan berdasarkan tanggal terbaru</li>
              </ul>
            </div>

            <div className="p-4 glass rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Isi Data Export</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Transaksi:</strong> Tanggal, jenis, jumlah, kategori, deskripsi
                </li>
                <li>
                  • <strong>Hutang:</strong> Kreditor, jumlah, sisa, jatuh tempo, status
                </li>
                <li>
                  • <strong>Tabungan:</strong> Nama target, target, terkumpul, progress, deadline
                </li>
              </ul>
            </div>

            <div className="p-4 glass rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Tips Export</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gunakan filter tanggal untuk data periode tertentu</li>
                <li>• File akan otomatis terunduh ke folder Downloads</li>
                <li>• Data yang di-export sesuai dengan yang Anda pilih</li>
                <li>• Format mata uang menggunakan Rupiah (IDR)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
