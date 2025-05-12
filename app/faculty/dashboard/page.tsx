"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getUserLocation } from "@/lib/location-service"
import { generateQRSession } from "@/lib/qr-service"
import FacultyLayout from "@/components/layouts/faculty-layout"
import {
  QrCode,
  ListChecks,
  BookOpen,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Settings,
  LogOut,
  Calendar,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { logoutUser } from "@/lib/auth-service"
import { useRouter } from "next/navigation"

export default function FacultyDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [sessionDuration, setSessionDuration] = useState("15")
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState("")
  const [facultyCourses, setFacultyCourses] = useState<any[]>([])

  // New state for date and time fields
  const [sessionDate, setSessionDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("")

  // Handle URL parameters for direct navigation
  useEffect(() => {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const courseParam = urlParams.get("course")
    const actionParam = urlParams.get("action")
    const tabParam = urlParams.get("tab")

    // Set tab if specified
    if (tabParam) {
      setActiveTab(tabParam)
    }

    // Handle course and action parameters
    if (courseParam && actionParam) {
      // Set the selected course based on the URL parameter
      if (actionParam === "generate") {
        setSelectedCourse(courseParam)
        setActiveTab("generate")
      } else if (actionParam === "attendance") {
        setSelectedCourseForAttendance(courseParam)
        setActiveTab("attendance")
      }
    }

    // Set default date and time values
    const now = new Date()
    setSessionDate(now.toISOString().split("T")[0])
    setStartTime(now.toTimeString().slice(0, 5))

    // Calculate default end time (current time + 1 hour)
    const endTimeDate = new Date(now.getTime() + 60 * 60 * 1000)
    setEndTime(endTimeDate.toTimeString().slice(0, 5))

    // Set day of week
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    setDayOfWeek(days[now.getDay()])
  }, [])

  // Load courses
  useEffect(() => {
    // In a real implementation, this would fetch from your API
    const mockCourses = [
      { id: "CSC101", name: "Introduction to Computer Science" },
      { id: "CSC202", name: "Data Structures and Algorithms" },
      { id: "MTH201", name: "Calculus II" },
      { id: "PHY102", name: "Physics for Engineers" },
    ]

    setCourses(mockCourses)
    if (mockCourses.length > 0) {
      setSelectedCourse(mockCourses[0].id)
      setSelectedCourseForAttendance(mockCourses[0].id)
    }

    // Load faculty courses from localStorage
    const storedCourses = localStorage.getItem("facultyCourses")
    if (storedCourses) {
      try {
        setFacultyCourses(JSON.parse(storedCourses))
      } catch (e) {
        console.error("Error parsing stored courses:", e)
        setFacultyCourses([])
      }
    }
  }, [])

  // Load attendance records when tab or selected course changes
  useEffect(() => {
    if (activeTab === "attendance" && selectedCourseForAttendance) {
      fetchAttendanceRecords(selectedCourseForAttendance)
    }
  }, [activeTab, selectedCourseForAttendance])

  // Update day of week when date changes
  useEffect(() => {
    if (sessionDate) {
      const date = new Date(sessionDate)
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      setDayOfWeek(days[date.getDay()])
    }
  }, [sessionDate])

  const fetchAttendanceRecords = async (courseId: string) => {
    // In a real implementation, this would fetch from your API
    // For this example, we'll use mock data
    const mockRecords = [
      { id: 1, studentId: "12345", studentName: "John Smith", date: "2023-05-01", time: "09:15 AM", status: "Present" },
      { id: 2, studentId: "12346", studentName: "Jane Doe", date: "2023-05-01", time: "09:18 AM", status: "Present" },
      {
        id: 3,
        studentId: "12347",
        studentName: "Bob Johnson",
        date: "2023-05-01",
        time: "09:20 AM",
        status: "Present",
      },
      {
        id: 4,
        studentId: "12348",
        studentName: "Alice Williams",
        date: "2023-05-01",
        time: "09:22 AM",
        status: "Present",
      },
      {
        id: 5,
        studentId: "12349",
        studentName: "Charlie Brown",
        date: "2023-05-01",
        time: "09:00 AM",
        status: "Absent",
      },
    ]

    setAttendanceRecords(mockRecords)
  }

  const handleGenerateQR = async () => {
    if (!selectedCourse) {
      setError("Please select a course")
      return
    }

    if (!sessionDate) {
      setError("Please select a session date")
      return
    }

    if (!startTime) {
      setError("Please select a start time")
      return
    }

    if (!endTime) {
      setError("Please select an end time")
      return
    }

    setLoading(true)
    setError("")
    setQrCodeData(null)

    try {
      // Get current location
      const location = await getUserLocation()

      if (!location) {
        setError("Could not access your location. Please enable location services.")
        return
      }

      // Parse date components
      const dateObj = new Date(sessionDate)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth() + 1 // JavaScript months are 0-indexed
      const day = dateObj.getDate()

      // Generate QR session
      const result = await generateQRSession({
        courseId: selectedCourse,
        courseName: courses.find((c) => c.id === selectedCourse)?.name || "",
        duration: Number.parseInt(sessionDuration),
        location,
        sessionDetails: {
          date: sessionDate,
          startTime,
          endTime,
          dayOfWeek,
          day,
          month,
          year,
        },
      })

      if (result.success) {
        setQrCodeData(result.qrData)

        // Add course to faculty courses
        addFacultyCourse(selectedCourse, courses.find((c) => c.id === selectedCourse)?.name || "")
      } else {
        setError(result.message || "Failed to generate QR code. Please try again.")
      }
    } catch (err) {
      console.error("Error generating QR code:", err)
      setError("An error occurred while generating the QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add a course to faculty courses
  const addFacultyCourse = (courseId: string, courseName: string) => {
    // Check if course already exists
    const existingCourseIndex = facultyCourses.findIndex((course) => course.id === courseId)

    if (existingCourseIndex !== -1) {
      // Update existing course
      const updatedCourses = [...facultyCourses]
      updatedCourses[existingCourseIndex] = {
        ...updatedCourses[existingCourseIndex],
        name: courseName,
        lastUsed: new Date().toISOString(),
        sessions: (updatedCourses[existingCourseIndex].sessions || 1) + 1,
      }
      setFacultyCourses(updatedCourses)
    } else {
      // Add new course
      setFacultyCourses([
        ...facultyCourses,
        {
          id: courseId,
          name: courseName,
          created: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          sessions: 1,
        },
      ])
    }

    // Save to localStorage
    localStorage.setItem("facultyCourses", JSON.stringify(facultyCourses))
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutUser()
      if (result.success) {
        // Clear any local storage data
        localStorage.removeItem("facultyCourses")
        // Redirect to login page
        window.location.href = "/login"
      } else {
        setError("Failed to log out. Please try again.")
      }
    } catch (err) {
      console.error("Logout error:", err)
      setError("An error occurred during logout. Please try again.")
    }
  }

  return (
    <FacultyLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/faculty/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <ListChecks className="mr-2 h-4 w-4" />
              View Attendance
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Attendance QR Code</CardTitle>
                <CardDescription>Create a QR code for students to scan and mark their attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="course">Select Course</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.id} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="sessionDate">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Session Date
                      </Label>
                      <Input
                        type="date"
                        id="sessionDate"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="dayOfWeek">Day of Week</Label>
                      <Input type="text" id="dayOfWeek" value={dayOfWeek} readOnly className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Start Time
                      </Label>
                      <Input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="endTime">
                        <Clock className="h-4 w-4 inline mr-1" />
                        End Time
                      </Label>
                      <Input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="duration">Session Duration (minutes)</Label>
                    <Select value={sessionDuration} onValueChange={setSessionDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateQR}
                    disabled={loading || !selectedCourse || !sessionDate || !startTime || !endTime}
                  >
                    {loading ? "Generating..." : "Generate QR Code"}
                  </Button>

                  {qrCodeData && (
                    <div className="mt-6 text-center">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        <img
                          src={`data:image/png;base64,${qrCodeData}`}
                          alt="Attendance QR Code"
                          className="w-64 h-64"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        This QR code will expire in {sessionDuration} minutes. Have students scan it to mark their
                        attendance.
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => window.print()}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print QR Code
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>View Attendance Records</CardTitle>
                <CardDescription>Check attendance records for your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="attendanceCourse">Select Course</Label>
                    <Select value={selectedCourseForAttendance} onValueChange={setSelectedCourseForAttendance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.id} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.studentId}</TableCell>
                            <TableCell className="font-medium">{record.studentName}</TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.time}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to CSV
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Courses you have created QR codes for</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Refresh courses
                    const storedCourses = localStorage.getItem("facultyCourses")
                    if (storedCourses) {
                      try {
                        setFacultyCourses(JSON.parse(storedCourses))
                      } catch (e) {
                        console.error("Error parsing stored courses:", e)
                      }
                    }
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {facultyCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      You haven't created any QR codes yet. Generate a QR code to add a course here.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course ID</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Sessions</TableHead>
                          <TableHead>Last Used</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facultyCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>{course.id}</TableCell>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>{course.sessions || 1}</TableCell>
                            <TableCell>
                              {new Date(course.lastUsed).toLocaleDateString()}{" "}
                              {new Date(course.lastUsed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCourse(course.id)
                                    setActiveTab("generate")
                                  }}
                                >
                                  <QrCode className="mr-2 h-4 w-4" />
                                  Generate QR
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCourseForAttendance(course.id)
                                    setActiveTab("attendance")
                                  }}
                                >
                                  <ListChecks className="mr-2 h-4 w-4" />
                                  View Attendance
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total courses: {facultyCourses.length}</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FacultyLayout>
  )
}
