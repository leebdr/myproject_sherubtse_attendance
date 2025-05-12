"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MailIcon, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // In a real app, this would call an API endpoint to send a password reset email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? "Check your email for a password reset link"
              : "Enter your institutional email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <MailIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-green-800">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-green-700 mt-1">If you don't see it, check your spam folder or try again.</p>
              </div>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to login
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Institutional Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@rub.edu.bt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
