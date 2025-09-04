import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeTransactions = searchParams.get("transactions") === "true"
    const includeDebts = searchParams.get("debts") === "true"
    const includeSavings = searchParams.get("savings") === "true"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const workbook = XLSX.utils.book_new()

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    const applyHeaderStyle = (worksheet: XLSX.WorkSheet, range: string) => {
      if (!worksheet["!merges"]) worksheet["!merges"] = []
      if (!worksheet["!cols"]) worksheet["!cols"] = []

      // Apply header formatting
      const headerRange = XLSX.utils.decode_range(range)
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!worksheet[cellAddress]) continue

        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F46E5" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        }
      }
    }

    // Export Transactions
    if (includeTransactions) {
      let transactionQuery = `
        SELECT 
          date as "Tanggal",
          CASE 
            WHEN type = 'income' THEN 'Pemasukan'
            WHEN type = 'expense' THEN 'Pengeluaran'
          END as "Jenis",
          amount as "Jumlah",
          category as "Kategori",
          description as "Deskripsi",
          created_at as "Dibuat"
        FROM transactions 
        WHERE user_id = $1
      `

      const params = [user.id]
      let paramIndex = 2

      if (startDate) {
        transactionQuery += ` AND date >= $${paramIndex}`
        params.push(startDate)
        paramIndex++
      }

      if (endDate) {
        transactionQuery += ` AND date <= $${paramIndex}`
        params.push(endDate)
        paramIndex++
      }

      transactionQuery += " ORDER BY date DESC, created_at DESC"

      console.log("[v0] Executing transaction query:", transactionQuery)
      console.log("[v0] Query parameters:", params)

      const transactionResult = await sql.unsafe(transactionQuery, params)
      console.log("[v0] Transaction query result:", transactionResult)
      console.log("[v0] Is result array?", Array.isArray(transactionResult))
      console.log("[v0] Result length:", transactionResult?.length)

      const transactions = Array.isArray(transactionResult) ? transactionResult : []

      if (transactions.length === 0) {
        console.log("[v0] No transactions found for user:", user.id)
      }

      const transactionData = transactions.map((t: any) => ({
        Tanggal: new Date(t.Tanggal).toLocaleDateString("id-ID", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        Jenis: t.Jenis,
        Jumlah: formatCurrency(Number(t.Jumlah)),
        Kategori: t.Kategori,
        Deskripsi: t.Deskripsi,
        Dibuat: new Date(t.Dibuat).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))

      let transactionSheet
      if (transactionData.length > 0) {
        transactionSheet = XLSX.utils.json_to_sheet(transactionData)
      } else {
        // Create empty sheet with headers and no data message
        const emptyData = [
          {
            Tanggal: "Tidak ada data transaksi",
            Jenis: "",
            Jumlah: "",
            Kategori: "",
            Deskripsi: "",
            Dibuat: "",
          },
        ]
        transactionSheet = XLSX.utils.json_to_sheet(emptyData)
      }

      transactionSheet["!cols"] = [
        { width: 18 }, // Tanggal
        { width: 14 }, // Jenis
        { width: 20 }, // Jumlah
        { width: 18 }, // Kategori
        { width: 35 }, // Deskripsi
        { width: 22 }, // Dibuat
      ]

      // Apply header styling
      if (transactionData.length > 0) {
        applyHeaderStyle(transactionSheet, `A1:F1`)

        // Add alternating row colors
        for (let i = 1; i <= transactionData.length; i++) {
          const rowColor = i % 2 === 0 ? "F8FAFC" : "FFFFFF"
          for (let col = 0; col < 6; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: i, c: col })
            if (transactionSheet[cellAddress]) {
              transactionSheet[cellAddress].s = {
                fill: { fgColor: { rgb: rowColor } },
                border: {
                  top: { style: "thin", color: { rgb: "E2E8F0" } },
                  bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                  left: { style: "thin", color: { rgb: "E2E8F0" } },
                  right: { style: "thin", color: { rgb: "E2E8F0" } },
                },
              }
            }
          }
        }
      }

      XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transaksi")
    }

    // Export Debts
    if (includeDebts) {
      const debtResult = await sql`
        SELECT 
          creditor_name as "Kreditor",
          amount as "Jumlah Total",
          remaining_amount as "Sisa Hutang",
          CASE 
            WHEN is_paid THEN 'Lunas'
            ELSE 'Belum Lunas'
          END as "Status",
          due_date as "Jatuh Tempo",
          description as "Deskripsi",
          created_at as "Dibuat"
        FROM debts 
        WHERE user_id = ${user.id}
        ORDER BY is_paid ASC, due_date ASC NULLS LAST, created_at DESC
      `
      const debts = Array.isArray(debtResult) ? debtResult : []

      const debtData = debts.map((d: any) => ({
        Kreditor: d.Kreditor,
        "Jumlah Total": formatCurrency(Number(d["Jumlah Total"])),
        "Sisa Hutang": formatCurrency(Number(d["Sisa Hutang"])),
        Status: d.Status,
        "Jatuh Tempo": d["Jatuh Tempo"]
          ? new Date(d["Jatuh Tempo"]).toLocaleDateString("id-ID", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
        Deskripsi: d.Deskripsi,
        Dibuat: new Date(d.Dibuat).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))

      const debtSheet = XLSX.utils.json_to_sheet(debtData)

      debtSheet["!cols"] = [
        { width: 22 }, // Kreditor
        { width: 20 }, // Jumlah Total
        { width: 20 }, // Sisa Hutang
        { width: 14 }, // Status
        { width: 18 }, // Jatuh Tempo
        { width: 35 }, // Deskripsi
        { width: 22 }, // Dibuat
      ]

      // Apply styling
      if (debtData.length > 0) {
        applyHeaderStyle(debtSheet, `A1:G1`)

        for (let i = 1; i <= debtData.length; i++) {
          const rowColor = i % 2 === 0 ? "F8FAFC" : "FFFFFF"
          for (let col = 0; col < 7; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: i, c: col })
            if (debtSheet[cellAddress]) {
              debtSheet[cellAddress].s = {
                fill: { fgColor: { rgb: rowColor } },
                border: {
                  top: { style: "thin", color: { rgb: "E2E8F0" } },
                  bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                  left: { style: "thin", color: { rgb: "E2E8F0" } },
                  right: { style: "thin", color: { rgb: "E2E8F0" } },
                },
              }
            }
          }
        }
      }

      XLSX.utils.book_append_sheet(workbook, debtSheet, "Hutang")
    }

    // Export Savings Goals
    if (includeSavings) {
      const savingsResult = await sql`
        SELECT 
          goal_name as "Nama Target",
          target_amount as "Jumlah Target",
          current_amount as "Terkumpul",
          ROUND((current_amount / target_amount * 100)::numeric, 2) as "Progress (%)",
          target_date as "Target Tanggal",
          description as "Deskripsi",
          created_at as "Dibuat"
        FROM savings_goals 
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
      `
      const savings = Array.isArray(savingsResult) ? savingsResult : []

      const savingsData = savings.map((s: any) => ({
        "Nama Target": s["Nama Target"],
        "Jumlah Target": formatCurrency(Number(s["Jumlah Target"])),
        Terkumpul: formatCurrency(Number(s.Terkumpul)),
        "Progress (%)": `${Number(s["Progress (%)"])}%`,
        "Target Tanggal": s["Target Tanggal"]
          ? new Date(s["Target Tanggal"]).toLocaleDateString("id-ID", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
        Deskripsi: s.Deskripsi,
        Dibuat: new Date(s.Dibuat).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))

      const savingsSheet = XLSX.utils.json_to_sheet(savingsData)

      savingsSheet["!cols"] = [
        { width: 25 }, // Nama Target
        { width: 20 }, // Jumlah Target
        { width: 20 }, // Terkumpul
        { width: 14 }, // Progress
        { width: 18 }, // Target Tanggal
        { width: 35 }, // Deskripsi
        { width: 22 }, // Dibuat
      ]

      // Apply styling
      if (savingsData.length > 0) {
        applyHeaderStyle(savingsSheet, `A1:G1`)

        for (let i = 1; i <= savingsData.length; i++) {
          const rowColor = i % 2 === 0 ? "F8FAFC" : "FFFFFF"
          for (let col = 0; col < 7; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: i, c: col })
            if (savingsSheet[cellAddress]) {
              savingsSheet[cellAddress].s = {
                fill: { fgColor: { rgb: rowColor } },
                border: {
                  top: { style: "thin", color: { rgb: "E2E8F0" } },
                  bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                  left: { style: "thin", color: { rgb: "E2E8F0" } },
                  right: { style: "thin", color: { rgb: "E2E8F0" } },
                },
              }
            }
          }
        }
      }

      XLSX.utils.book_append_sheet(workbook, savingsSheet, "Tabungan")
    }

    const summaryData = [
      { Keterangan: "LAPORAN KEUANGAN DOMPETKU", Nilai: "" },
      { Keterangan: "", Nilai: "" },
      { Keterangan: "Informasi Pengguna:", Nilai: "" },
      { Keterangan: "Nama Pengguna", Nilai: user.name },
      { Keterangan: "Email", Nilai: user.email },
      {
        Keterangan: "Tanggal Export",
        Nilai: new Date().toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      { Keterangan: "", Nilai: "" },
      { Keterangan: "Filter Periode:", Nilai: "" },
      {
        Keterangan: "Dari Tanggal",
        Nilai: startDate
          ? new Date(startDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Semua data",
      },
      {
        Keterangan: "Sampai Tanggal",
        Nilai: endDate
          ? new Date(endDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Semua data",
      },
      { Keterangan: "", Nilai: "" },
      { Keterangan: "Data yang Di-export:", Nilai: "" },
      { Keterangan: "✓ Transaksi", Nilai: includeTransactions ? "Ya" : "Tidak" },
      { Keterangan: "✓ Hutang", Nilai: includeDebts ? "Ya" : "Tidak" },
      { Keterangan: "✓ Tabungan", Nilai: includeSavings ? "Ya" : "Tidak" },
    ]

    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    summarySheet["!cols"] = [{ width: 25 }, { width: 40 }]

    // Style the summary sheet
    for (let i = 0; i < summaryData.length; i++) {
      const keteranganCell = XLSX.utils.encode_cell({ r: i, c: 0 })
      const nilaiCell = XLSX.utils.encode_cell({ r: i, c: 1 })

      if (i === 0) {
        // Title row
        if (summarySheet[keteranganCell]) {
          summarySheet[keteranganCell].s = {
            font: { bold: true, size: 16, color: { rgb: "1F2937" } },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "EFF6FF" } },
          }
        }
      } else if (summaryData[i].Keterangan.includes(":")) {
        // Section headers
        if (summarySheet[keteranganCell]) {
          summarySheet[keteranganCell].s = {
            font: { bold: true, color: { rgb: "374151" } },
            fill: { fgColor: { rgb: "F3F4F6" } },
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })

    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `laporan-keuangan-${user.name.replace(/\s+/g, "-").toLowerCase()}-${timestamp}.xlsx`

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating Excel export:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat export" }, { status: 500 })
  }
}
