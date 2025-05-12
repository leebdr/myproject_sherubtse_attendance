"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FacultyLayout from "@/components/layouts/faculty-layout"
import { Save, Bell, Lock, User, Shield } from "lucide-react"

export default function FacultySettings() {
  const [activeTab, setActiveTab] = useState("account")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    setSaveSuccess(true)
    setSaveError("")

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would validate and change the password
    setSaveSuccess(true)
    setSaveError("")

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  return (
    <FacultyLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">Your settings have been saved successfully.</AlertDescription>
          </Alert>
        )}

        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Dr. Robert Johnson" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="robert.sherubtse@rub.edu.bt" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Computer Science" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue="Associate Professor" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+975 17123456" />
                  </div>

                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button type="submit">
                    <Shield className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </form>
              </CardContent>
              <Separator className="my-4" />
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a verification code via SMS when logging in.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="attendance-notifications" />
                  <Label htmlFor="attendance-notifications">Email notifications for attendance submissions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="report-notifications" />
                  <Label htmlFor="report-notifications">Weekly attendance report emails</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="system-notifications" />
                  <Label htmlFor="system-notifications">System update notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="browser-notifications" />
                  <Label htmlFor="browser-notifications">Browser push notifications</Label>
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FacultyLayout>
  )
}
