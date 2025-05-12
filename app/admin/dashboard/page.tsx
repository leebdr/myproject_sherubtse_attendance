"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminLayout from "@/components/layouts/admin-layout"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [attendanceStats, setAttendanceStats] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Load mock data
  useEffect(() => {
    // Mock users
    const mockUsers = [
      { id: 1, name: "John Smith", email: "12345.sherubtse@rub.edu.bt", role: "student", status: "active" },
      { id: 2, name: "Jane Doe", email: "12346.sherubtse@rub.edu.bt", role: "student", status: "active" },
      { id: 3, name: "Dr. Robert Johnson", email: "robert.sherubtse@rub.edu.bt", role: "faculty", status: "active" },
      { id: 4, name: "Prof. Sarah Williams", email: "sarah.sherubtse@rub.edu.bt", role: "faculty", status: "active" },
      { id: 5, name: "Admin User", email: "admin.sherubtse@rub.edu.bt", role: "admin", status: "active" },
      { id: 6, name: "Admin Tech Support", email: "admin123.sherubtse@rub.edu.bt", role: "admin", status: "active" },
      {
        id: 7,
        name: "System Administrator",
        email: "sysadmin2023.sherubtse@rub.edu.bt",
        role: "admin",
        status: "active",
      },
      { id: 8, name: "Charlie Brown", email: "12349.sherubtse@rub.edu.bt", role: "student", status: "inactive" },
    ]

    // Mock courses
    const mockCourses = [
      {
        id: "CSC101",
        name: "Introduction to Computer Science",
        faculty: "Dr. Robert Johnson",
        students: 45,
        department: "Computer Science",
      },
      {
        id: "CSC202",
        name: "Data Structures and Algorithms",
        faculty: "Dr. Robert Johnson",
        students: 38,
        department: "Computer Science",
      },
      { id: "MTH201", name: "Calculus II", faculty: "Prof. Sarah Williams", students: 52, department: "Mathematics" },
      {
        id: "PHY102",
        name: "Physics for Engineers",
        faculty: "Dr. Michael Brown",
        students: 41,
        department: "Physics",
      },
    ]

    // Mock attendance stats
    const mockStats = [
      { id: "CSC101", name: "Introduction to Computer Science", present: 40, absent: 5, percentage: 89 },
      { id: "CSC202", name: "Data Structures and Algorithms", present: 35, absent: 3, percentage: 92 },
      { id: "MTH201", name: "Calculus II", present: 48, absent: 4, percentage: 92 },
      { id: "PHY102", name: "Physics for Engineers", present: 36, absent: 5, percentage: 88 },
    ]

    setUsers(mockUsers)
    setCourses(mockCourses)
    setAttendanceStats(mockStats)
  }, [])

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {users.filter((u) => u.role === "student").length} students,{" "}
                {users.filter((u) => u.role === "faculty").length} faculty,{" "}
                {users.filter((u) => u.role === "admin").length} admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {new Set(courses.map((c) => c.department)).size} departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(attendanceStats.reduce((acc, stat) => acc + stat.percentage, 0) / attendanceStats.length)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="courses">Manage Courses</TabsTrigger>
            <TabsTrigger value="reports">Attendance Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search
                    </Label>
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="md:w-auto">Add User</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="capitalize">{user.role}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              {user.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage all courses in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-6">
                  <Input placeholder="Search courses..." className="max-w-sm" />
                  <Button>Add Course</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.id}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.faculty}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>View attendance statistics across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-48">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select defaultValue="thisWeek">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="thisWeek">This Week</SelectItem>
                          <SelectItem value="thisMonth">This Month</SelectItem>
                          <SelectItem value="lastMonth">Last Month</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-48">
                      <Label htmlFor="department">Department</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" className="mr-2">
                      Export to CSV
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      Print Report
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Absent</TableHead>
                        <TableHead>Attendance %</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceStats.map((stat) => (
                        <TableRow key={stat.id}>
                          <TableCell className="font-medium">{stat.id}</TableCell>
                          <TableCell>{stat.name}</TableCell>
                          <TableCell>{stat.present}</TableCell>
                          <TableCell>{stat.absent}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                                <div
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{ width: `${stat.percentage}%` }}
                                ></div>
                              </div>
                              <span>{stat.percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
