"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { verifyAttendance } from "@/lib/attendance-service"
import { getUserLocation } from "@/lib/location-service"
import StudentLayout from "@/components/layouts/student-layout"
import Link from "next/link"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("scan")
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<null | { success: boolean; message: string }>(null)
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [filteredHistory, setFilteredHistory] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load courses and attendance history
  useEffect(() => {
    const fetchData = async () => {
      // In a real implementation, this would fetch from your API
      // For this example, we'll use mock data
      const mockHistory = [
        { id: 1, course: "CSC101", date: "2023-05-01", time: "09:15 AM", status: "Present" },
        { id: 2, course: "MTH201", date: "2023-05-01", time: "11:30 AM", status: "Present" },
        { id: 3, course: "PHY102", date: "2023-04-30", time: "02:45 PM", status: "Absent" },
        { id: 4, course: "ENG103", date: "2023-04-29", time: "10:00 AM", status: "Present" },
        { id: 5, course: "CSC202", date: "2023-04-28", time: "01:15 PM", status: "Present" },
      ]

      setAttendanceHistory(mockHistory)

      // Extract unique courses
      const uniqueCourses = Array.from(new Set(mockHistory.map((record) => record.course)))
      setCourses(uniqueCourses)
    }

    fetchData()
  }, [])

  // Filter attendance history when course selection changes
  useEffect(() => {
    if (selectedCourse === "all") {
      setFilteredHistory(attendanceHistory)
    } else {
      setFilteredHistory(attendanceHistory.filter((record) => record.course === selectedCourse))
    }
  }, [selectedCourse, attendanceHistory])

  const startScanner = async () => {
    try {
      setScanning(true)
      setScanResult(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // In a real implementation, you would use a QR code scanning library
        // For this example, we'll simulate scanning after a delay
        setTimeout(() => {
          simulateScan()
        }, 3000)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setScanResult({
        success: false,
        message: "Could not access camera. Please ensure camera permissions are granted.",
      })
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    setScanning(false)
  }

  const simulateScan = async () => {
    setLoading(true)

    try {
      // Capture image for face verification
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          const faceImage = canvas.toDataURL("image/jpeg")

          // Get current location
          const location = await getUserLocation()

          if (!location) {
            setScanResult({
              success: false,
              message: "Could not access your location. Please enable location services.",
            })
            setLoading(false)
            return
          }

          // Simulate QR code data (in a real app, this would come from scanning)
          const qrData = {
            sessionId: "session_123456",
            courseId: "CSC101",
            courseName: "Introduction to Computer Science",
            instructor: "Dr. John Doe",
            timestamp: new Date().toISOString(),
            location: {
              latitude: location.latitude + 0.0001, // Simulate nearby location
              longitude: location.longitude + 0.0001,
            },
          }

          // Verify attendance
          const result = await verifyAttendance({
            qrData,
            faceImage,
            userLocation: location,
          })

          setScanResult(result)
        }
      }
    } catch (err) {
      console.error("Error during scan:", err)
      setScanResult({
        success: false,
        message: "An error occurred during scanning. Please try again.",
      })
    } finally {
      stopScanner()
      setLoading(false)
    }
  }

  return (
    <StudentLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md">Student</div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Welcome, Sangay!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Use the tabs below to scan QR codes for attendance or view your attendance history.</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Attendance QR Code</CardTitle>
                <CardDescription>Scan the QR code displayed by your instructor to mark your attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult && (
                  <Alert variant={scanResult.success ? "default" : "destructive"} className="mb-4">
                    <AlertDescription>{scanResult.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {scanning ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-blue-500 border-dashed rounded-lg"></div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
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
                          className="mx-auto mb-4 text-gray-400"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M7 7h.01" />
                          <path d="M17 7h.01" />
                          <path d="M7 17h.01" />
                          <path d="M17 17h.01" />
                        </svg>
                        <p>Camera preview will appear here</p>
                      </div>
                    )}
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex justify-center">
                    {scanning ? (
                      <Button variant="destructive" onClick={stopScanner} disabled={loading}>
                        Cancel
                      </Button>
                    ) : (
                      <Button onClick={startScanner} className="px-8 bg-blue-600 hover:bg-blue-700">
                        Start Scanning
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>View your attendance records for all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label htmlFor="course-filter" className="block text-sm font-medium mb-1">
                    Filter by Course
                  </label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger id="course-filter" className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.course}</TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.time}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>View all your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card key={course} className="overflow-hidden">
                      <div className="bg-blue-600 h-2"></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course}</CardTitle>
                        <CardDescription>
                          {course === "CSC101" && "Introduction to Computer Science"}
                          {course === "MTH201" && "Advanced Mathematics"}
                          {course === "PHY102" && "Physics Fundamentals"}
                          {course === "ENG103" && "English Composition"}
                          {course === "CSC202" && "Data Structures"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Instructor:</span>
                            <span>
                              {course === "CSC101" && "Dr. John Doe"}
                              {course === "MTH201" && "Prof. Sarah Johnson"}
                              {course === "PHY102" && "Dr. Michael Chen"}
                              {course === "ENG103" && "Prof. Emily Wilson"}
                              {course === "CSC202" && "Dr. Robert Brown"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Schedule:</span>
                            <span>
                              {course === "CSC101" && "Mon, Wed 9:00-10:30"}
                              {course === "MTH201" && "Tue, Thu 11:00-12:30"}
                              {course === "PHY102" && "Mon, Fri 2:00-3:30"}
                              {course === "ENG103" && "Wed, Fri 10:00-11:30"}
                              {course === "CSC202" && "Tue, Thu 1:00-2:30"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Attendance:</span>
                            <span className="font-medium">
                              {course === "CSC101" && "90%"}
                              {course === "MTH201" && "85%"}
                              {course === "PHY102" && "75%"}
                              {course === "ENG103" && "95%"}
                              {course === "CSC202" && "88%"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link href="/student/profile">
            <Button variant="outline" className="bg-white hover:bg-gray-100">
              View and Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </StudentLayout>
  )
}
