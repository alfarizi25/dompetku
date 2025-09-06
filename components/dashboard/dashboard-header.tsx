"use client"

import { useState, useEffect } from "react"
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
  const [pathname, setPathname] = useState("")

  // Fallback for environments where usePathname might not be available
  const nextPathname = usePathname ? usePathname() : null
  const router = useRouter ? useRouter() : null

  useEffect(() => {
    setPathname(nextPathname || window.location.pathname)
  }, [nextPathname])


  const handleLogout = async () => {
    try {
      console.log("[v0] Logout initiated")
      const response = await fetch("/api/auth/logout", { method: "POST" })
      console.log("[v0] Logout response:", response.status)

      if (response.ok) {
        console.log("[v0] Logout successful, redirecting...")
        if (router) {
          router.push("/")
        } else {
          window.location.href = "/"
        }
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
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a
              href="/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover-lift transition-all duration-200"
            >
              DompetKu
            </a>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                    active
                      ? "bg-secondary font-medium" // Background untuk item aktif
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "")}/>
                  <span className={cn("hidden lg:inline text-sm xl:text-base", active ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "")}>
                    {item.name}
                  </span>
                </a>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
              >
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive md:hidden"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-card">
            <nav className="space-y-1 max-h-96 overflow-y-auto">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                      active
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "")}/>
                    <span className={cn("truncate", active ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "")}>
                      {item.name}
                    </span>
                  </a>
                )
              })}
              <Button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                style={{ animationDelay: `${navigation.length * 0.1}s` }}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Keluar</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}