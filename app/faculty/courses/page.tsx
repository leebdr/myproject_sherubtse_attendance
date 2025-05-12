"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import FacultyLayout from "@/components/layouts/faculty-layout"
import { QrCode, ListChecks, RefreshCw, Search, Plus } from "lucide-react"
import Link from "next/link"

export default function FacultyCourses() {
  const [facultyCourses, setFacultyCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load faculty courses
  useEffect(() => {
    loadCourses()
    setIsLoading(false)
  }, [])

  const loadCourses = () => {
    // Get courses from localStorage
    const storedCourses = localStorage.getItem("facultyCourses")
    if (storedCourses) {
      try {
        setFacultyCourses(JSON.parse(storedCourses))
      } catch (e) {
        console.error("Error parsing stored courses:", e)
        setFacultyCourses([])
      }
    } else {
      setFacultyCourses([])
    }
  }

  // Filter courses based on search query
  const filteredCourses = facultyCourses.filter(
    (course) =>
      course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <FacultyLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your courses and attendance sessions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadCourses}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/faculty/dashboard?tab=generate">
                <Plus className="mr-2 h-4 w-4" />
                New Course Session
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Course List</CardTitle>
                <CardDescription>Courses you have created QR codes for</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : facultyCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't created any QR codes yet. Generate a QR code to add a course here.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/faculty/dashboard?tab=generate">
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Link>
                </Button>
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
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.id}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.sessions || 1}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(course.lastUsed).toLocaleDateString()}{" "}
                          {new Date(course.lastUsed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/faculty/dashboard?course=${course.id}&action=generate`}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Generate QR
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/faculty/dashboard?course=${course.id}&action=attendance`}>
                                <ListChecks className="mr-2 h-4 w-4" />
                                View Attendance
                              </Link>
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
      </div>
    </FacultyLayout>
  )
}
