const QRCode = require("qrcode")
const QRSession = require("../models/QRSession")
const Course = require("../models/Course")

// Generate QR code for attendance
exports.generateQR = async (req, res) => {
  try {
    const { courseId, courseName, duration } = req.body
    const facultyId = req.session.user.id

    // Get location from request
    const location = {
      latitude: Number.parseFloat(req.body.latitude),
      longitude: Number.parseFloat(req.body.longitude),
    }

    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: "Location data is required",
      })
    }

    // Validate course data
    if (!courseId || !courseName) {
      return res.status(400).json({
        success: false,
        message: "Course ID and name are required",
      })
    }

    // Create QR session
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + Number.parseInt(duration, 10))

    const sessionData = {
      courseId,
      courseName,
      facultyId,
      location,
      expiresAt,
    }

    const sessionId = await QRSession.create(sessionData)

    // Generate QR code with session ID
    const qrData = {
      sessionId,
      courseId,
      courseName,
      facultyName: req.session.user.name,
      timestamp: new Date().toISOString(),
      location,
      expiresAt: expiresAt.toISOString(),
    }

    // Convert to JSON string
    const qrString = JSON.stringify(qrData)

    // Generate QR code as base64
    const qrCodeBase64 = await QRCode.toDataURL(qrString)

    // Return QR code data
    res.json({
      success: true,
      qrData: qrCodeBase64.split(",")[1], // Remove data:image/png;base64, prefix
      sessionId,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (err) {
    console.error("Error generating QR code:", err)
    res.status(500).json({
      success: false,
      message: "Failed to generate QR code",
    })
  }
}

// Get all courses (for admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll()
    res.render("admin/courses", { title: "Course Management", courses })
  } catch (err) {
    console.error("Error fetching courses:", err)
    req.flash("error_msg", "Failed to fetch courses")
    res.redirect("/admin/dashboard")
  }
}

// Get courses by faculty
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const facultyId = req.session.user.id
    const courses = await Course.findByFaculty(facultyId)

    res.json({ success: true, courses })
  } catch (err) {
    console.error("Error fetching faculty courses:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    })
  }
}
