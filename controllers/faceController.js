// Face registration controller

// Get face registration page
exports.getRegisterFace = (req, res) => {
  // Check if user is in session
  if (!req.session.user) {
    req.flash("error_msg", "Please register first")
    return res.redirect("/register")
  }

  res.render("auth/register-face", {
    title: "Face Registration",
    user: req.session.user,
  })
}

// Process face registration
exports.postRegisterFace = async (req, res) => {
  try {
    // In a real implementation, this would process and store the face data
    const { faceImage } = req.body

    if (!faceImage) {
      req.flash("error_msg", "No face image provided")
      return res.redirect("/register-face")
    }

    // Here you would save the face data to the user's record
    // For this demo, we'll just simulate success

    // Update user in session to indicate face is registered
    req.session.user.faceRegistered = true

    // Get user role from session
    const userRole = req.session.user.role || "student"

    // Redirect based on role
    if (userRole === "student") {
      res.redirect("/student/dashboard")
    } else if (userRole === "faculty") {
      res.redirect("/faculty/dashboard")
    } else if (userRole === "admin") {
      res.redirect("/admin/dashboard")
    } else {
      res.redirect("/")
    }
  } catch (err) {
    console.error("Error registering face:", err)
    req.flash("error_msg", "An error occurred during face registration")
    res.redirect("/register-face")
  }
}

// Verify face for authentication
exports.verifyFace = async (req, res) => {
  try {
    // In a real implementation, this would verify the face against stored data
    const { faceImage, userId } = req.body

    // For this demo, we'll just simulate success
    res.json({ success: true, message: "Face verified successfully" })
  } catch (err) {
    console.error("Error verifying face:", err)
    res.status(500).json({ success: false, message: "Face verification failed" })
  }
}
