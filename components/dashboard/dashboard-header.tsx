"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Menu, X, Home, CreditCard, PiggyBank, TrendingUp, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  user: {
    id: string
    name: string
    email: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      console.log("[v0] Logout initiated")
      const response = await fetch("/api/auth/logout", { method: "POST" })
      console.log("[v0] Logout response:", response.status)

      if (response.ok) {
        console.log("[v0] Logout successful, redirecting...")
        router.push("/")
      } else {
        console.error("[v0] Logout failed:", response.status)
        alert("Gagal logout. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
      alert("Terjadi kesalahan saat logout.")
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transaksi", href: "/transactions", icon: TrendingUp },
    { name: "Hutang", href: "/debts", icon: CreditCard },
    { name: "Tabungan", href: "/savings", icon: PiggyBank },
    { name: "Laporan", href: "/reports", icon: FileText },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover-lift transition-all duration-200"
            >
              DompetKu
            </Link>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 focus-ring",
                    active
                      ? "bg-white/20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/10",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 bg-white/10 border-white/20 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg rounded-md"
                align="end"
              >
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600 focus:bg-red-50 md:hidden"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="md:hidden button-press focus-ring"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm mobile-menu-enter">
            <nav className="space-y-1">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 focus-ring animate-slide-in-left",
                      active
                        ? "bg-white/20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/10",
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 animate-slide-in-left"
                style={{ animationDelay: `${navigation.length * 0.1}s` }}
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
