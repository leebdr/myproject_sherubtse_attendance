const User = require("../models/User")
const Course = require("../models/Course")
const Attendance = require("../models/Attendance")

// Get admin dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Get count of all users
    const users = await User.findAll()
    const totalUsers = users.length
    const students = users.filter((user) => user.role === "student").length
    const faculty = users.filter((user) => user.role === "faculty").length
    const admins = users.filter((user) => user.role === "admin").length

    // Get all courses
    const courses = await Course.findAll()
    const totalCourses = courses.length
    const departments = [...new Set(courses.map((course) => course.department))].length

    // Calculate average attendance
    const attendanceRecords = await Attendance.findAll()
    let avgAttendance = 0

    if (attendanceRecords.length > 0) {
      // Group by courseId and calculate percentage
      const courseAttendances = {}
      attendanceRecords.forEach((record) => {
        if (!courseAttendances[record.courseId]) {
          courseAttendances[record.courseId] = { present: 0, total: 0 }
        }
        courseAttendances[record.courseId].present += record.status === "present" ? 1 : 0
        courseAttendances[record.courseId].total += 1
      })

      // Calculate average across all courses
      let totalPercentage = 0
      let numCourses = 0
      for (const courseId in courseAttendances) {
        const { present, total } = courseAttendances[courseId]
        if (total > 0) {
          totalPercentage += (present / total) * 100
          numCourses++
        }
      }
      avgAttendance = numCourses > 0 ? Math.round(totalPercentage / numCourses) : 0
    }

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      user: req.user || req.session.user,
      totalUsers,
      students,
      faculty,
      admins,
      totalCourses,
      departments,
      avgAttendance,
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    })
  } catch (err) {
    console.error("Error fetching admin dashboard data:", err)
    req.flash("error_msg", "Error loading dashboard data")
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      user: req.user || req.session.user,
      error_msg: req.flash("error_msg"),
    })
  }
}

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll()

    res.render("admin/users", {
      title: "User Management",
      users,
      user: req.user || req.session.user,
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    })
  } catch (err) {
    console.error("Error fetching users:", err)
    req.flash("error_msg", "Error loading users")
    res.redirect("/admin/dashboard")
  }
}

// Add user
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, department, course, year, hostel } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      req.flash("error_msg", "User with this email already exists")
      return res.redirect("/admin/users")
    }

    // Create user object
    const userData = {
      name,
      email,
      password, // In a real app, you would hash this
      role,
      gender,
    }

    // Add role-specific fields
    if (role === "student") {
      userData.department = department
      userData.course = course
      userData.year = year
      userData.hostel = hostel
    }

    // Create user
    await User.create(userData)

    req.flash("success_msg", "User added successfully")
    res.redirect("/admin/users")
  } catch (err) {
    console.error("Error adding user:", err)
    req.flash("error_msg", "Error adding user")
    res.redirect("/admin/users")
  }
}

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body

    // Update user status
    await User.updateStatus(userId, status)

    req.flash("success_msg", "User status updated successfully")
    res.redirect("/admin/users")
  } catch (err) {
    console.error("Error updating user status:", err)
    req.flash("error_msg", "Error updating user status")
    res.redirect("/admin/users")
  }
}

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll()
    const faculty = await User.findAll()
    const facultyMembers = faculty.filter((user) => user.role === "faculty")

    res.render("admin/courses", {
      title: "Course Management",
      courses,
      facultyMembers,
      user: req.user || req.session.user,
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    })
  } catch (err) {
    console.error("Error fetching courses:", err)
    req.flash("error_msg", "Error loading courses")
    res.redirect("/admin/dashboard")
  }
}

// Add course
exports.addCourse = async (req, res) => {
  try {
    const { id, name, facultyId, department, students } = req.body

    // Check if course already exists
    const existingCourse = await Course.findById(id)
    if (existingCourse) {
      req.flash("error_msg", "Course with this ID already exists")
      return res.redirect("/admin/courses")
    }

    // Create course
    await Course.create({
      id,
      name,
      facultyId,
      department,
      students: Number.parseInt(students),
    })

    req.flash("success_msg", "Course added successfully")
    res.redirect("/admin/courses")
  } catch (err) {
    console.error("Error adding course:", err)
    req.flash("error_msg", "Error adding course")
    res.redirect("/admin/courses")
  }
}

// Get attendance reports
exports.getReports = async (req, res) => {
  try {
    const dateRange = req.query.dateRange || "thisWeek"
    const department = req.query.department || "all"

    // Get all attendance records
    const allAttendance = await Attendance.findAll()

    // Filter by date range
    const now = new Date()
    let filteredAttendance = allAttendance

    if (dateRange === "today") {
      filteredAttendance = allAttendance.filter((record) => {
        const recordDate = new Date(record.timestamp)
        return recordDate.toDateString() === now.toDateString()
      })
    } else if (dateRange === "thisWeek") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())

      filteredAttendance = allAttendance.filter((record) => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= weekStart
      })
    } else if (dateRange === "thisMonth") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      filteredAttendance = allAttendance.filter((record) => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= monthStart
      })
    } else if (dateRange === "lastMonth") {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      filteredAttendance = allAttendance.filter((record) => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= lastMonthStart && recordDate <= lastMonthEnd
      })
    }

    // Get all courses
    const courses = await Course.findAll()

    // Filter by department if needed
    let filteredCourses = courses
    if (department !== "all") {
      filteredCourses = courses.filter((course) => course.department.toLowerCase() === department.toLowerCase())
    }

    // Calculate attendance stats for each course
    const reports = filteredCourses.map((course) => {
      const courseAttendance = filteredAttendance.filter((record) => record.courseId === course.id)
      const present = courseAttendance.filter((record) => record.status === "present").length
      const total = courseAttendance.length
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0

      return {
        id: course.id,
        name: course.name,
        present,
        absent: total - present,
        percentage,
      }
    })

    res.render("admin/reports", {
      title: "Attendance Reports",
      reports,
      dateRange,
      department,
      user: req.user || req.session.user,
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    })
  } catch (err) {
    console.error("Error fetching reports:", err)
    req.flash("error_msg", "Error loading reports")
    res.redirect("/admin/dashboard")
  }
}

// Get settings page
exports.getSettings = async (req, res) => {
  try {
    res.render("admin/settings", {
      title: "Admin Settings",
      user: req.user || req.session.user,
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    })
  } catch (err) {
    console.error("Error loading settings:", err)
    req.flash("error_msg", "Error loading settings")
    res.redirect("/admin/dashboard")
  }
}

// Update system settings
exports.updateSettings = async (req, res) => {
  try {
    const { maxDistance, sessionDuration, attendanceThreshold } = req.body

    // In a real app, you would save these to your database or config file
    // For this example, we'll just show success message

    req.flash("success_msg", "Settings updated successfully")
    res.redirect("/admin/settings")
  } catch (err) {
    console.error("Error updating settings:", err)
    req.flash("error_msg", "Error updating settings")
    res.redirect("/admin/settings")
  }
}

// Export data to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const { type, dateRange, department } = req.query

    // In a real app, you would generate a CSV file based on the parameters
    // For this example, we'll just send a dummy CSV file

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=${type}_report.csv`)

    if (type === "users") {
      res.write("ID,Name,Email,Role,Status\n")
      res.write("1,John Smith,12345.sherubtse@rub.edu.bt,student,active\n")
      res.write("2,Jane Doe,12346.sherubtse@rub.edu.bt,student,active\n")
      res.write("3,Dr. Robert Johnson,robert.sherubtse@rub.edu.bt,faculty,active\n")
    } else if (type === "courses") {
      res.write("ID,Name,Faculty,Department,Students\n")
      res.write("CSC101,Introduction to Computer Science,Dr. Robert Johnson,Computer Science,45\n")
      res.write("CSC202,Data Structures and Algorithms,Dr. Robert Johnson,Computer Science,38\n")
    } else if (type === "attendance") {
      res.write("Course,Date,Students Present,Students Absent,Percentage\n")
      res.write("CSC101,2023-05-01,40,5,89%\n")
      res.write("CSC202,2023-05-01,35,3,92%\n")
    }

    res.end()
  } catch (err) {
    console.error("Error exporting data:", err)
    req.flash("error_msg", "Error exporting data")
    res.redirect("/admin/dashboard")
  }
}
