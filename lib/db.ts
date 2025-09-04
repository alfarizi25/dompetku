import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export type User = {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: number
  user_id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  created_at: string
  updated_at: string
}

export type Debt = {
  id: number
  user_id: string
  creditor_name: string
  amount: number
  remaining_amount: number
  description?: string
  due_date?: string
  is_paid: boolean
  created_at: string
  updated_at: string
}

export type SavingsGoal = {
  id: number
  user_id: string
  goal_name: string
  target_amount: number
  current_amount: number
  target_date?: string
  description?: string
  created_at: string
  updated_at: string
}
