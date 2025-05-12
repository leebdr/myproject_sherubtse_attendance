"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StudentLayout from "@/components/layouts/student-layout"

export default function StudentProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Mock student data - in a real app, this would come from your API
  const student = {
    id: "12345",
    name: "Sangay",
    email: "sangay@sherubtse.edu.bt",
    studentId: "12345",
    gender: "Male",
    dateOfBirth: "1999-05-15",
    phone: "975-17123456",
    address: "Thubtenling Hostel, Room 203",
    department: "DOPS",
    course: "BSc in Physics",
    year: "2",
    semester: "Spring 2023",
    enrollmentDate: "2021-08-15",
    cgpa: "3.7",
    bio: "I'm a second-year Physics student interested in theoretical physics and astronomy.",
    hostel: "Thubtenling",
    roomNumber: "203",
    emergencyContact: {
      name: "Dorji",
      relationship: "Father",
      phone: "975-17789012",
    },
  }

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1500)
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })

      // Reset form
      const form = event.target as HTMLFormElement
      form.reset()
    }, 1500)
  }

  return (
    <StudentLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Profile</h1>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md">Student</div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {student.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage your personal information, academic details, and account settings below.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={student.name} className="avatar-image" />
                <AvatarFallback className="bg-blue-600 text-white">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.email}</p>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-2">
                  Student ID: {student.studentId}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{student.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-medium">{student.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{student.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CGPA:</span>
                  <span className="font-medium">{student.cgpa}</span>
                </div>
              </div>
              <div className="w-full mt-4">
                <label htmlFor="profile-photo" className="w-full">
                  <Button variant="outline" className="w-full cursor-pointer" asChild>
                    <span>Change Photo</span>
                  </Button>
                </label>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      toast({
                        title: "Error",
                        description: "File is too large. Maximum size is 5MB.",
                        variant: "destructive",
                      })
                      return
                    }

                    // Check file type
                    if (!file.type.match("image.*")) {
                      toast({
                        title: "Error",
                        description: "Please select an image file.",
                        variant: "destructive",
                      })
                      return
                    }

                    // Create a URL for the file
                    const url = URL.createObjectURL(file)

                    // Update the avatar image
                    const avatarImage = document.querySelector(".avatar-image") as HTMLImageElement
                    if (avatarImage) {
                      avatarImage.src = url
                    }

                    // Show success toast
                    toast({
                      title: "Success",
                      description: "Profile photo updated successfully!",
                    })

                    // In a real implementation, you would upload the file to the server here
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>

                  {/* Personal Information Tab */}
                  <TabsContent value="personal">
                    <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={student.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={student.email} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Student ID</Label>
                          <Input id="studentId" defaultValue={student.studentId} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select defaultValue={student.gender.toLowerCase()}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input id="dateOfBirth" type="date" defaultValue={student.dateOfBirth} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue={student.phone} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue={student.address} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" defaultValue={student.bio} rows={3} />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyName">Contact Name</Label>
                            <Input id="emergencyName" defaultValue={student.emergencyContact.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyRelationship">Relationship</Label>
                            <Input id="emergencyRelationship" defaultValue={student.emergencyContact.relationship} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Phone Number</Label>
                            <Input id="emergencyPhone" defaultValue={student.emergencyContact.phone} />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Academic Information Tab */}
                  <TabsContent value="academic">
                    <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select defaultValue={student.department}>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DOAH">Department of Arts and Humanities (DOAH)</SelectItem>
                              <SelectItem value="DOSS">Department of Social Sciences (DOSS)</SelectItem>
                              <SelectItem value="DOELS">Department of Environment & Life Science (DOELS)</SelectItem>
                              <SelectItem value="DOPS">Department of Physical Science (DOPS)</SelectItem>
                              <SelectItem value="DOMS">Department of Mathematical Sciences (DOMS)</SelectItem>
                              <SelectItem value="FIRST">New Programmes - First Year (FIRST)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course">Course</Label>
                          <Input id="course" defaultValue={student.course} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Select defaultValue={student.year}>
                            <SelectTrigger id="year">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">First Year</SelectItem>
                              <SelectItem value="2">Second Year</SelectItem>
                              <SelectItem value="3">Third Year</SelectItem>
                              <SelectItem value="4">Fourth Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="semester">Current Semester</Label>
                          <Input id="semester" defaultValue={student.semester} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                          <Input id="enrollmentDate" type="date" defaultValue={student.enrollmentDate} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cgpa">CGPA</Label>
                          <Input id="cgpa" defaultValue={student.cgpa} disabled />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Hostel Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hostel">Hostel</Label>
                            <Select defaultValue={student.hostel}>
                              <SelectTrigger id="hostel">
                                <SelectValue placeholder="Select hostel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Thubtenling">Thubtenling</SelectItem>
                                <SelectItem value="Pemaling">Pemaling</SelectItem>
                                <SelectItem value="Singye">Singye</SelectItem>
                                <SelectItem value="Sherubling">Sherubling</SelectItem>
                                <SelectItem value="None">None (Day Scholar)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roomNumber">Room Number</Label>
                            <Input id="roomNumber" defaultValue={student.roomNumber} />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Account Settings Tab */}
                  <TabsContent value="account">
                    <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" required />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                          {isLoading ? "Changing Password..." : "Change Password"}
                        </Button>
                      </div>
                    </form>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Account Management</h3>
                      <p className="text-sm text-muted-foreground">These actions are permanent and cannot be undone.</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline">Export My Data</Button>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
