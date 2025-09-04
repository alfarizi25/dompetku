import { sql } from "./db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "./db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, name: string, password: string) {
  const hashedPassword = await hashPassword(password)
  const userId = crypto.randomUUID()

  const result = await sql`
    INSERT INTO users (id, email, name, password_hash)
    VALUES (${userId}, ${email}, ${name}, ${hashedPassword})
    RETURNING id, email, name, created_at, updated_at
  `

  return result[0]
}

export async function authenticateUser(email: string, password: string) {
  const users = await sql`
    SELECT * FROM users WHERE email = ${email}
  `

  if (users.length === 0) {
    return null
  }

  const user = users[0] as User
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const users = await sql`
    SELECT id, email, name, created_at, updated_at 
    FROM users 
    WHERE id = ${session.userId}
  `

  return users[0] as Omit<User, "password_hash"> | null
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
