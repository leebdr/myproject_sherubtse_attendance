import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt="Sherubtse College Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-blue-800">Sherubtse College</h1>
          </div>
          <div className="space-x-2">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced Attendance Tracking System</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure, reliable attendance tracking with facial recognition, QR code scanning, and GPS verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanning</CardTitle>
                <CardDescription>Session-specific QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Faculty generates time and location-bound QR codes for each session.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facial Recognition</CardTitle>
                <CardDescription>Identity verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                    <path d="M8 9h8" />
                    <path d="M8 15h8" />
                    <path d="M8 5h8" />
                    <path d="M8 19h8" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Regula SDK captures and verifies student identity through facial recognition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GPS Verification</CardTitle>
                <CardDescription>Location validation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Ensures students are physically present within the class location radius.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>Automatic role assignment based on email pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left">Email Pattern</th>
                      <th className="border px-4 py-2 text-left">Role</th>
                      <th className="border px-4 py-2 text-left">Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">number.sherubtse@rub.edu.bt</td>
                      <td className="border px-4 py-2">Student</td>
                      <td className="border px-4 py-2">Scan QR, verify identity</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">letter.sherubtse@rub.edu.bt</td>
                      <td className="border px-4 py-2">Faculty</td>
                      <td className="border px-4 py-2">Generate QR, view attendance</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">admin.sherubtse@rub.edu.bt</td>
                      <td className="border px-4 py-2">Admin</td>
                      <td className="border px-4 py-2">Manage users, view reports</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Sherubtse College Attendance Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
