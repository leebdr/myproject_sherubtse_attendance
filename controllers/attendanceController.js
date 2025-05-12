const Attendance = require("../models/Attendance")
const QRSession = require("../models/QRSession")
const User = require("../models/User")
const { calculateDistance } = require("../utils/gpsUtils")
const faceController = require("./faceController")

// Verify attendance
exports.verifyAttendance = async (req, res) => {
  try {
    const { qrData, faceImage, userLocation } = req.body
    const studentId = req.session.user.id

    // Parse QR data
    let sessionData
    try {
      sessionData = JSON.parse(qrData)
    } catch (err) {
      return res.json({
        success: false,
        message: "Invalid QR code format",
      })
    }

    // Verify QR session is valid
    const session = await QRSession.findById(sessionData.sessionId)

    if (!session) {
      return res.json({
        success: false,
        message: "Invalid or expired QR code",
      })
    }

    // Check if session has expired
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)

    if (now > expiresAt) {
      return res.json({
        success: false,
        message: "QR code has expired",
      })
    }

    // Check if attendance already marked
    const existingAttendance = await Attendance.findBySessionAndStudent(session.id, studentId)

    if (existingAttendance) {
      return res.json({
        success: false,
        message: "Attendance already marked for this session",
      })
    }

    // Verify location
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      session.location.latitude,
      session.location.longitude,
    )

    const MAX_DISTANCE = 50 // 50 meters

    if (distance > MAX_DISTANCE) {
      return res.json({
        success: false,
        message: `You are too far from the class location (${Math.round(distance)}m away, max ${MAX_DISTANCE}m)`,
      })
    }

    // Verify face
    const faceResult = await faceController.verifyFaceInternal(studentId, faceImage)

    if (!faceResult.success) {
      return res.json({
        success: false,
        message: "Face verification failed: " + faceResult.message,
      })
    }

    // All checks passed, mark attendance
    const attendanceData = {
      sessionId: session.id,
      studentId,
      courseId: session.courseId,
      timestamp: new Date(),
      location: userLocation,
      faceScore: faceResult.score,
      status: "present",
    }

    await Attendance.create(attendanceData)

    return res.json({
      success: true,
      message: "Attendance marked successfully",
    })
  } catch (err) {
    console.error("Error verifying attendance:", err)
    return res.json({
      success: false,
      message: "An error occurred while verifying attendance",
    })
  }
}

// Scan QR code (student)
exports.scanQR = async (req, res) => {
  try {
    const { qrData, faceImage, latitude, longitude } = req.body

    const userLocation = {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    }

    // Call verify attendance
    const result = await this.verifyAttendance(
      {
        session: req.session,
        body: { qrData, faceImage, userLocation },
      },
      { json: (data) => data },
    )

    if (result.success) {
      req.flash("success_msg", "Attendance marked successfully")
    } else {
      req.flash("error_msg", result.message)
    }

    res.redirect("/student/dashboard")
  } catch (err) {
    console.error("Error scanning QR:", err)
    req.flash("error_msg", "An error occurred while scanning QR code")
    res.redirect("/student/dashboard")
  }
}

// Get attendance by faculty
exports.getAttendanceByFaculty = async (req, res) => {
  try {
    const facultyId = req.session.user.id
    const courseId = req.params.courseId

    // Get all sessions for this course by this faculty
    const sessions = await QRSession.findByCourseAndFaculty(courseId, facultyId)

    if (!sessions || sessions.length === 0) {
      req.flash("error_msg", "No attendance sessions found for this course")
      return res.redirect("/faculty/dashboard")
    }

    // Get all attendance records for these sessions
    const sessionIds = sessions.map((session) => session.id)
    const attendanceRecords = await Attendance.findBySessionIds(sessionIds)

    // Get student details for each attendance record
    const studentIds = [...new Set(attendanceRecords.map((record) => record.studentId))]
    const students = await User.findByIds(studentIds)

    // Map student details to attendance records
    const attendanceWithStudents = attendanceRecords.map((record) => {
      const student = students.find((s) => s.id === record.studentId)
      return {
        ...record,
        studentName: student ? student.name : "Unknown",
        studentEmail: student ? student.email : "Unknown",
        department: student ? student.department : "",
        course: student ? student.course : "",
        hostel: student ? student.hostel : "",
        gender: student ? student.gender : "",
        year: student ? student.year : "",
      }
    })

    res.render("faculty/attendance", {
      title: "Attendance Records",
      courseId,
      attendance: attendanceWithStudents,
    })
  } catch (err) {
    console.error("Error fetching attendance:", err)
    req.flash("error_msg", "Failed to fetch attendance records")
    res.redirect("/faculty/dashboard")
  }
}

// Get all attendance (admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll()

    // Get student details
    const studentIds = [...new Set(attendance.map((record) => record.studentId))]
    const students = await User.findByIds(studentIds)

    // Map student details to attendance records
    const attendanceWithStudents = attendance.map((record) => {
      const student = students.find((s) => s.id === record.studentId)
      return {
        ...record,
        studentName: student ? student.name : "Unknown",
        studentEmail: student ? student.email : "Unknown",
        department: student ? student.department : "",
        course: student ? student.course : "",
        hostel: student ? student.hostel : "",
        gender: student ? student.gender : "",
        year: student ? student.year : "",
      }
    })

    res.render("admin/attendance", {
      title: "Attendance Records",
      attendance: attendanceWithStudents,
    })
  } catch (err) {
    console.error("Error fetching attendance:", err)
    req.flash("error_msg", "Failed to fetch attendance records")
    res.redirect("/admin/dashboard")
  }
}
