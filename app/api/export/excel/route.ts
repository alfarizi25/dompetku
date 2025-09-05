import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import * as XLSX from "xlsx"

// Helper function to apply styling to a range of cells
function applyStyle(worksheet: XLSX.WorkSheet, range: XLSX.Range, style: any) {
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: R })
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" }
      worksheet[cellAddress].s = style
    }
  }
}

// Helper to merge and style cells for titles
function mergeAndStyle(ws: XLSX.WorkSheet, row: number, colStart: number, colEnd: number, text: string, style: any) {
    ws["!merges"] = ws["!merges"] || [];
    ws["!merges"].push({ s: { r: row, c: colStart }, e: { r: row, c: colEnd } });
    const cellAddress = XLSX.utils.encode_cell({c: colStart, r: row});
    // Ensure the cell exists before styling
    if(!ws[cellAddress]) ws[cellAddress] = { t: 's', v: text };
    else ws[cellAddress].v = text;
    ws[cellAddress].s = style;
}


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
    const startDate = searchParams.get("startDate") || null
    const endDate = searchParams.get("endDate") || null

    const workbook = XLSX.utils.book_new()

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)

    const formatDate = (dateStr: string | null) =>
      dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-"
    
    // --- Build Base Queries ---
    let transactionQuery = sql`SELECT date, type, amount, category, description FROM transactions WHERE user_id = ${user.id}`
    let debtQuery = sql`SELECT creditor_name, amount, remaining_amount, is_paid, due_date, description FROM debts WHERE user_id = ${user.id}`
    let savingsQuery = sql`SELECT goal_name, target_amount, current_amount, target_date, description FROM savings_goals WHERE user_id = ${user.id}`

    if (startDate && endDate) {
      transactionQuery = sql`${transactionQuery} AND date BETWEEN ${startDate} AND ${endDate}`
    } else if (startDate) {
      transactionQuery = sql`${transactionQuery} AND date >= ${startDate}`
    } else if (endDate) {
      transactionQuery = sql`${transactionQuery} AND date <= ${endDate}`
    }
    
    // --- Fetch All Data ---
    const allTransactions = await transactionQuery
    const allDebts = await debtQuery
    const allSavings = await savingsQuery

    // --- Styling Constants ---
    const titleStyle = { font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2E5B9A" } }, alignment: { horizontal: "center" } };
    const sectionTitleStyle = { font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4F81BD" } } };
    const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "DCE6F1" } } };
    const totalStyle = { font: { bold: true }, alignment: { horizontal: "right" } };
    const currencyFormat = '_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"??_);_(@_)';

    // --- 1. Summary Sheet with Visuals ---
    const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalRemainingDebt = allDebts.reduce((sum, d) => sum + Number(d.remaining_amount), 0);
    const totalSaved = allSavings.reduce((sum, s) => sum + Number(s.current_amount), 0);
    const totalTarget = allSavings.reduce((sum, s) => sum + Number(s.target_amount), 0);
    
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const savingsRatio = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const createProgressBar = (percentage: number) => {
        const filledBlocks = Math.round(percentage / 10);
        const emptyBlocks = 10 - filledBlocks;
        return `[${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}] ${percentage.toFixed(1)}%`;
    };

    const summaryData = [
        [`RINGKASAN KEUANGAN - ${user.name}`],
        [],
        ["Ringkasan Transaksi"],
        ["Total Pemasukan", totalIncome],
        ["Total Pengeluaran", totalExpenses],
        ["Saldo", totalIncome - totalExpenses],
        ["Rasio Pengeluaran", createProgressBar(expenseRatio)],
        [],
        ["Ringkasan Hutang"],
        ["Total Sisa Hutang", totalRemainingDebt],
        ["Hutang Lunas", `${allDebts.filter(d => d.is_paid).length} dari ${allDebts.length}`],
        [],
        ["Ringkasan Tabungan"],
        ["Total Terkumpul", totalSaved],
        ["Total Target", totalTarget],
        ["Progress Tabungan", createProgressBar(savingsRatio)],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ width: 30 }, { width: 30 }];
    
    mergeAndStyle(summarySheet, 0, 0, 1, `RINGKASAN KEUANGAN - ${user.name}`, titleStyle);
    mergeAndStyle(summarySheet, 2, 0, 1, "Ringkasan Transaksi", sectionTitleStyle);
    mergeAndStyle(summarySheet, 8, 0, 1, "Ringkasan Hutang", sectionTitleStyle);
    mergeAndStyle(summarySheet, 12, 0, 1, "Ringkasan Tabungan", sectionTitleStyle);
    
    // Format currency
    [3, 4, 5, 9, 13, 14].forEach(r => {
        const cell = summarySheet[XLSX.utils.encode_cell({r, c:1})];
        if(cell && typeof cell.v === 'number') {
            cell.z = currencyFormat;
        }
    });

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");


    // --- 2. Transactions Sheet ---
    if (includeTransactions) {
      const incomeData = allTransactions
        .filter((t) => t.type === 'income')
        .map((t) => [formatDate(t.date), t.category, t.description, Number(t.amount)]);
      
      const expenseData = allTransactions
        .filter((t) => t.type === 'expense')
        .map((t) => [formatDate(t.date), t.category, t.description, Number(t.amount)]);

      const transactionHeaders = ["Tanggal", "Kategori", "Deskripsi", "Jumlah"];
      
      let transactionSheetData: any[][] = [
        [`LAPORAN TRANSAKSI - ${user.name}`],
        [],
        ["PEMASUKAN"],
        transactionHeaders,
        ...incomeData,
        ["", "", "Total Pemasukan", totalIncome],
        [],
        ["PENGELUARAN"],
        transactionHeaders,
        ...expenseData,
        ["", "", "Total Pengeluaran", totalExpenses],
      ];
      
      const transactionSheet = XLSX.utils.aoa_to_sheet(transactionSheetData);
      transactionSheet['!cols'] = [{ width: 15 }, { width: 25 }, { width: 40 }, { width: 20 }];

      mergeAndStyle(transactionSheet, 0, 0, 3, `LAPORAN TRANSAKSI - ${user.name}`, titleStyle);
      mergeAndStyle(transactionSheet, 2, 0, 3, "PEMASUKAN", sectionTitleStyle);
      applyStyle(transactionSheet, {s: {r: 3, c: 0}, e: {r: 3, c: 3}}, headerStyle);
      applyStyle(transactionSheet, {s: {r: 4 + incomeData.length, c: 0}, e: {r: 4 + incomeData.length, c: 3}}, totalStyle);
      
      const expenseStartRow = 7 + incomeData.length;
      mergeAndStyle(transactionSheet, expenseStartRow, 0, 3, "PENGELUARAN", sectionTitleStyle);
      applyStyle(transactionSheet, {s: {r: expenseStartRow + 1, c: 0}, e: {r: expenseStartRow + 1, c: 3}}, headerStyle);
      applyStyle(transactionSheet, {s: {r: expenseStartRow + 2 + expenseData.length, c: 0}, e: {r: expenseStartRow + 2 + expenseData.length, c: 3}}, totalStyle);
      
      // Format currency columns
      incomeData.forEach((_, i) => {
          const row = 4 + i;
          const cell = transactionSheet[XLSX.utils.encode_cell({r:row, c:3})];
          if(cell) cell.z = currencyFormat;
      });
      expenseData.forEach((_, i) => {
          const row = expenseStartRow + 2 + i;
          const cell = transactionSheet[XLSX.utils.encode_cell({r:row, c:3})];
          if(cell) cell.z = currencyFormat;
      });

      const totalIncomeCell = transactionSheet[XLSX.utils.encode_cell({r: 4 + incomeData.length, c: 3})];
      if(totalIncomeCell) totalIncomeCell.z = currencyFormat;
      
      const totalExpenseCell = transactionSheet[XLSX.utils.encode_cell({r: expenseStartRow + 2 + expenseData.length, c: 3})];
      if(totalExpenseCell) totalExpenseCell.z = currencyFormat;
      
      XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transaksi");
    }

    // --- 3. Debts & Savings Sheets ---
    if (includeDebts) {
        const data = allDebts.map((d: any) => ({
            Kreditor: d.creditor_name, "Jumlah Total": Number(d.amount), "Sisa Hutang": Number(d.remaining_amount),
            Status: d.is_paid ? 'Lunas' : 'Belum Lunas', "Jatuh Tempo": formatDate(d.due_date), Deskripsi: d.description
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [{ width: 25 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 40 }];
        applyStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, headerStyle);
        data.forEach((_, index) => {
            const row = index + 1;
            const cell1 = ws[XLSX.utils.encode_cell({r:row, c:1})];
            if(cell1) cell1.z = currencyFormat;
            const cell2 = ws[XLSX.utils.encode_cell({r:row, c:2})];
            if(cell2) cell2.z = currencyFormat;
        });
        XLSX.utils.book_append_sheet(workbook, ws, "Hutang");
    }

    if (includeSavings) {
        const data = allSavings.map((s: any) => ({
            "Nama Target": s.goal_name, "Jumlah Target": Number(s.target_amount), Terkumpul: Number(s.current_amount),
            "Progress (%)": totalTarget > 0 ? `${(Number(s.current_amount) / Number(s.target_amount) * 100).toFixed(1)}%` : "N/A",
            "Target Tanggal": formatDate(s.target_date), Deskripsi: s.description
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [{ width: 25 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 40 }];
        applyStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, headerStyle);
        data.forEach((_, index) => {
             const row = index + 1;
            const cell1 = ws[XLSX.utils.encode_cell({r:row, c:1})];
            if(cell1) cell1.z = currencyFormat;
            const cell2 = ws[XLSX.utils.encode_cell({r:row, c:2})];
            if(cell2) cell2.z = currencyFormat;
        });
        XLSX.utils.book_append_sheet(workbook, ws, "Tabungan");
    }
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })
    const filename = `laporan-keuangan-dompetku-${new Date().toISOString().split("T")[0]}.xlsx`

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

