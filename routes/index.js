const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const qrController = require("../controllers/qrController")
const attendanceController = require("../controllers/attendanceController")
const faceController = require("../controllers/faceController")
const { ensureAuthenticated, ensureRole } = require("../utils/authMiddleware")
const path = require("path")
const fs = require("fs")

// Add this near the top of the file with other requires
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")

// Home route
router.get("/", (req, res) => {
  res.render("index", { title: "Sherubtse College Attendance Tracker" })
})

// Auth routes - Fix the paths to match what the app expects
// Login routes
router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)

// Register routes
router.get("/register", authController.getRegister)
router.post("/register", authController.postRegister)

// Face registration routes
router.get("/register-face", ensureAuthenticated, faceController.getRegisterFace)
router.post("/register-face", ensureAuthenticated, faceController.postRegisterFace)

// Forgot password routes
router.get("/forgot-password", authController.getForgotPassword)
router.post("/forgot-password", authController.postForgotPassword)

// Logout routes
router.get("/logout", authController.logout)

// Dashboard route - redirects based on role
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.user || req.session.user
  const role = user ? user.role : null

  if (role === "student") {
    res.redirect("/student/dashboard")
  } else if (role === "faculty") {
    res.redirect("/faculty/dashboard")
  } else if (role === "admin") {
    res.redirect("/admin/dashboard")
  } else {
    // Default fallback
    res.redirect("/")
  }
})

// Student routes
router.get("/student/dashboard", ensureAuthenticated, ensureRole("student"), (req, res) => {
  // Get student-specific data
  const user = req.user || req.session.user
  const studentData = {
    name: user.fullName || user.name || "Student",
    email: user.email,
    id: user._id || "12345",
    // Mock data - in a real app, this would come from your database
    courses: [
      { id: "CSC101", name: "Introduction to Computer Science", instructor: "Dr. John Doe", attendance: "90%" },
      { id: "MTH201", name: "Advanced Mathematics", instructor: "Prof. Sarah Johnson", attendance: "85%" },
      { id: "PHY102", name: "Physics Fundamentals", instructor: "Dr. Michael Chen", attendance: "75%" },
      { id: "ENG103", name: "English Composition", instructor: "Prof. Emily Wilson", attendance: "95%" },
      { id: "CSC202", name: "Data Structures", instructor: "Dr. Robert Brown", attendance: "88%" },
    ],
    recentAttendance: [
      { course: "CSC101", date: new Date().toLocaleDateString(), time: "09:15 AM", status: "Present" },
      {
        course: "MTH201",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        time: "11:30 AM",
        status: "Present",
      },
      {
        course: "PHY102",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        time: "02:45 PM",
        status: "Absent",
      },
    ],
    stats: {
      totalCourses: 5,
      averageAttendance: "87%",
      missedClasses: 3,
      upcomingClasses: 2,
    },
  }

  res.render("student/dashboard", {
    title: "Student Dashboard",
    active: "dashboard",
    user: user,
    data: studentData,
  })
})

router.get("/student/profile", ensureAuthenticated, ensureRole("student"), (req, res) => {
  res.render("student/profile", {
    title: "Student Profile",
    active: "profile",
    user: req.user,
  })
})

router.get("/student/settings", ensureAuthenticated, ensureRole("student"), (req, res) => {
  res.render("student/settings", {
    title: "Student Settings",
    active: "settings",
    user: req.user,
  })
})

router.get("/student/courses", ensureAuthenticated, ensureRole("student"), (req, res) => {
  // Get student courses
  const courses = [
    {
      id: "CSC101",
      name: "Introduction to Computer Science",
      instructor: "Dr. John Doe",
      schedule: "Mon, Wed 9:00-10:30",
      attendance: "90%",
    },
    {
      id: "MTH201",
      name: "Advanced Mathematics",
      instructor: "Prof. Sarah Johnson",
      schedule: "Tue, Thu 11:00-12:30",
      attendance: "85%",
    },
    {
      id: "PHY102",
      name: "Physics Fundamentals",
      instructor: "Dr. Michael Chen",
      schedule: "Mon, Fri 2:00-3:30",
      attendance: "75%",
    },
    {
      id: "ENG103",
      name: "English Composition",
      instructor: "Prof. Emily Wilson",
      schedule: "Wed, Fri 10:00-11:30",
      attendance: "95%",
    },
    {
      id: "CSC202",
      name: "Data Structures",
      instructor: "Dr. Robert Brown",
      schedule: "Tue, Thu 1:00-2:30",
      attendance: "88%",
    },
  ]

  res.render("student/courses", {
    title: "My Courses",
    active: "courses",
    user: req.user,
    courses: courses,
  })
})

router.post("/student/scan-qr", ensureAuthenticated, ensureRole("student"), attendanceController.scanQR)

// Faculty routes
router.get("/faculty/dashboard", ensureAuthenticated, ensureRole("faculty"), (req, res) => {
  // Get faculty-specific data
  const facultyData = {
    name: req.user.fullName,
    email: req.user.email,
    id: req.user._id,
    // Mock data - in a real app, this would come from your database
    courses: [
      { id: "CSC101", name: "Introduction to Computer Science", students: 45, averageAttendance: "89%" },
      { id: "CSC202", name: "Data Structures and Algorithms", students: 38, averageAttendance: "92%" },
      { id: "CSC303", name: "Database Systems", students: 32, averageAttendance: "85%" },
    ],
    recentSessions: [
      { course: "CSC101", date: new Date().toLocaleDateString(), time: "09:00 AM", attendees: 42, total: 45 },
      {
        course: "CSC202",
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        time: "01:00 PM",
        attendees: 36,
        total: 38,
      },
      {
        course: "CSC303",
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        time: "10:30 AM",
        attendees: 30,
        total: 32,
      },
    ],
    stats: {
      totalCourses: 3,
      totalStudents: 115,
      averageAttendance: "89%",
      sessionsThisWeek: 5,
    },
  }

  res.render("faculty/dashboard", {
    title: "Faculty Dashboard",
    active: "dashboard",
    user: req.user,
    data: facultyData,
  })
})

router.get("/faculty/reports", ensureAuthenticated, ensureRole("faculty"), (req, res) => {
  res.render("faculty/reports", {
    title: "Reports",
    active: "reports",
    user: req.user,
  })
})

router.get("/faculty/profile", ensureAuthenticated, ensureRole("faculty"), (req, res) => {
  res.render("faculty/profile", {
    title: "Profile",
    active: "profile",
    user: req.user,
  })
})

router.get("/faculty/courses", ensureAuthenticated, ensureRole("faculty"), (req, res) => {
  // Get faculty courses
  const courses = [
    {
      id: "CSC101",
      name: "Introduction to Computer Science",
      students: 45,
      schedule: "Mon, Wed 9:00-10:30",
      room: "CS-101",
    },
    {
      id: "CSC202",
      name: "Data Structures and Algorithms",
      students: 38,
      schedule: "Tue, Thu 1:00-2:30",
      room: "CS-102",
    },
    { id: "CSC303", name: "Database Systems", students: 32, schedule: "Wed, Fri 11:00-12:30", room: "CS-103" },
  ]

  res.render("faculty/courses", {
    title: "My Courses",
    active: "courses",
    user: req.user,
    courses: courses,
  })
})

// Add this route after the other faculty routes
router.get("/faculty/settings", ensureAuthenticated, ensureRole("faculty"), (req, res) => {
  res.render("faculty/settings", {
    title: "Faculty Settings",
    active: "settings",
    user: req.user,
  })
})

router.post("/faculty/generate-qr", ensureAuthenticated, ensureRole("faculty"), qrController.generateQR)
router.get(
  "/faculty/attendance/:courseId",
  ensureAuthenticated,
  ensureRole("faculty"),
  attendanceController.getAttendanceByFaculty,
)

// Admin routes
// Find the admin dashboard route that looks like this:
// Replace it with this temporary fix:
router.get("/admin/dashboard", ensureAuthenticated, ensureRole("admin"), (req, res) => {
  // Get admin-specific data with default values to prevent undefined errors
  const adminData = {
    name: req.user.fullName || req.user.name,
    email: req.user.email,
    id: req.user._id,
    // Mock data - in a real app, this would come from your database
    userStats: {
      total: 150,
      students: 120,
      faculty: 25,
      admins: 5,
      active: 145,
      inactive: 5,
    },
    courseStats: {
      total: 25,
      departments: 5,
      averageAttendance: "88%",
    },
    recentUsers: [
      {
        id: 1,
        name: "John Smith",
        email: "12345.sherubtse@rub.edu.bt",
        role: "student",
        status: "active",
        created: new Date().toLocaleDateString(),
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "12346.sherubtse@rub.edu.bt",
        role: "student",
        status: "active",
        created: new Date(Date.now() - 86400000).toLocaleDateString(),
      },
      {
        id: 3,
        name: "Dr. Robert Johnson",
        email: "robert.sherubtse@rub.edu.bt",
        role: "faculty",
        status: "active",
        created: new Date(Date.now() - 172800000).toLocaleDateString(),
      },
    ],
    recentCourses: [
      {
        id: "CSC101",
        name: "Introduction to Computer Science",
        faculty: "Dr. Robert Johnson",
        students: 45,
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
    ],
  }

  // Provide default values for the dashboard stats
  const totalUsers = 150
  const students = 120
  const faculty = 25
  const totalCourses = 25
  const departments = 5
  const avgAttendance = 88

  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    active: "dashboard",
    user: req.user || req.session.user,
    data: adminData,
    totalUsers,
    students,
    faculty,
    totalCourses,
    departments,
    avgAttendance,
    success_msg: req.flash ? req.flash("success_msg") : null,
    error_msg: req.flash ? req.flash("error_msg") : null,
  })
})

// Add these admin routes
router.get("/admin/users", ensureAuthenticated, ensureRole("admin"), adminController.getUsers)
router.post("/admin/users/add", ensureAuthenticated, ensureRole("admin"), adminController.addUser)
router.post("/admin/users/update-status", ensureAuthenticated, ensureRole("admin"), adminController.updateUserStatus)

router.get("/admin/courses", ensureAuthenticated, ensureRole("admin"), adminController.getCourses)
router.post("/admin/courses/add", ensureAuthenticated, ensureRole("admin"), adminController.addCourse)

router.get("/admin/reports", ensureAuthenticated, ensureRole("admin"), adminController.getReports)
router.get("/admin/export", ensureAuthenticated, ensureRole("admin"), adminController.exportToCSV)

router.get("/admin/settings", ensureAuthenticated, ensureRole("admin"), adminController.getSettings)
router.post("/admin/settings/update", ensureAuthenticated, ensureRole("admin"), adminController.updateSettings)

router.get("/admin/attendance", ensureAuthenticated, ensureRole("admin"), attendanceController.getAllAttendance)

// API routes for AJAX requests
router.post("/api/verify-attendance", ensureAuthenticated, attendanceController.verifyAttendance)
router.post("/api/verify-face", ensureAuthenticated, faceController.verifyFace)

// Add these routes after other routes
// Profile photo upload route
router.post("/api/upload-profile-photo", ensureAuthenticated, userController.uploadProfilePhoto)

// Get user profile route
router.get("/api/profile", ensureAuthenticated, userController.getProfile)

// Update user profile route
router.post("/api/update-profile", ensureAuthenticated, userController.updateProfile)

module.exports = router
