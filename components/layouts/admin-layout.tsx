import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=32&width=32" alt="Sherubtse College Logo" className="h-8 w-8" />
            <h1 className="text-lg font-bold text-blue-800">Sherubtse College</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium">
              Users
            </Link>
            <Link href="/admin/courses" className="text-sm font-medium">
              Courses
            </Link>
            <Link href="/admin/reports" className="text-sm font-medium">
              Reports
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium">
              Settings
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin.sherubtse@rub.edu.bt</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/auth/logout" className="w-full">
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">{children}</main>

      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Sherubtse College Attendance Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
