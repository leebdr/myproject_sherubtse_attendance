"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/lib/auth-service"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [detectedRole, setDetectedRole] = useState<string | null>(null)

  // List of known admin email prefixes
  const knownAdminPrefixes = ["admin", "admin123", "sysadmin", "techadmin", "sysadmin2023"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Detect role based on email pattern
    if (name === "email") {
      detectRole(value)
    }
  }

  // Separate function to detect role for better debugging
  const detectRole = (email: string) => {
    const emailLower = email.toLowerCase()

    // Check if it's a valid institutional email
    if (!emailLower.endsWith(".sherubtse@rub.edu.bt")) {
      setDetectedRole(null)
      return
    }

    // Extract the prefix (everything before .sherubtse@rub.edu.bt)
    const prefix = emailLower.split(".sherubtse@rub.edu.bt")[0]

    console.log("Email prefix:", prefix) // For debugging

    // Check for admin emails first (known admin prefixes)
    if (knownAdminPrefixes.includes(prefix)) {
      setDetectedRole("admin")
      return
    }

    // Check for student emails (numbers only)
    if (/^\d+$/.test(prefix)) {
      setDetectedRole("student")
      return
    }

    // Check for faculty emails (letters only)
    if (/^[a-zA-Z]+$/.test(prefix)) {
      setDetectedRole("faculty")
      return
    }

    // Check for mixed alphanumeric (could be admin)
    if (/^[a-zA-Z0-9]+$/.test(prefix)) {
      // If it has both letters and numbers but isn't in known admin list,
      // we'll treat it as faculty for now
      setDetectedRole("faculty")
      return
    }

    // If none of the patterns match
    setDetectedRole(null)
  }

  // For debugging - log when detected role changes
  useEffect(() => {
    console.log("Detected role:", detectedRole)
  }, [detectedRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate email domain
    if (!formData.email.endsWith("@rub.edu.bt")) {
      setError("Please use your institutional email (@rub.edu.bt)")
      return
    }

    // Validate role detection
    if (!detectedRole) {
      setError("Invalid email format. Please use the correct institutional email format.")
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: detectedRole,
      })

      if (result.success) {
        // Redirect to face registration page
        router.push("/auth/register-face")
      } else {
        setError(result.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/placeholder.svg?height=64&width=64" alt="Sherubtse College Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Register with your institutional email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Institutional Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@rub.edu.bt"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {detectedRole && (
                <p className="text-sm text-green-600 mt-1">
                  Detected role: <span className="font-medium capitalize">{detectedRole}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                <strong>Email format guide:</strong>
                <br />• Students: <span className="font-mono">12345.sherubtse@rub.edu.bt</span> (numbers only)
                <br />• Faculty: <span className="font-mono">name.sherubtse@rub.edu.bt</span> (letters only)
                <br />• Admin: <span className="font-mono">admin123.sherubtse@rub.edu.bt</span> (letters and numbers)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
