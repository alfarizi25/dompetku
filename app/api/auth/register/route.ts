import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    const user = await createUser(email, name, password)
    await createSession(user.id)

    return NextResponse.json({
      message: "Registrasi berhasil",
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 })
    }

    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
