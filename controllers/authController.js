const User = require("../models/User")
const bcrypt = require("bcryptjs")

// List of known admin email prefixes
const knownAdminPrefixes = ["admin", "admin123", "sysadmin", "techadmin", "sysadmin2023"]

// Helper function to detect role from email
function detectRoleFromEmail(email) {
  const emailLower = email.toLowerCase()

  // Check if it's a valid institutional email
  if (!emailLower.endsWith(".sherubtse@rub.edu.bt")) {
    return null
  }

  // Extract the prefix (everything before .sherubtse@rub.edu.bt)
  const prefix = emailLower.split(".sherubtse@rub.edu.bt")[0]

  // Check for admin emails first (known admin prefixes)
  if (knownAdminPrefixes.includes(prefix)) {
    return "admin"
  }

  // Check for student emails (numbers only)
  if (/^\d+$/.test(prefix)) {
    return "student"
  }

  // Check for faculty emails (letters only)
  if (/^[a-zA-Z]+$/.test(prefix)) {
    return "faculty"
  }

  // Check for mixed alphanumeric (could be admin)
  if (/^[a-zA-Z0-9]+$/.test(prefix)) {
    // If it has both letters and numbers but isn't in known admin list,
    // we'll treat it as faculty for now
    return "faculty"
  }

  // If none of the patterns match
  return null
}

// Register page
exports.getRegister = (req, res) => {
  res.render("auth/register", { title: "Register" })
}

// Register handle
exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, gender } = req.body
    const errors = []

    // Check required fields
    if (!fullName || !email || !password || !confirmPassword || !gender) {
      errors.push({ msg: "Please fill in all fields" })
    }

    // Check passwords match
    if (password !== confirmPassword) {
      errors.push({ msg: "Passwords do not match" })
    }

    // Check password length
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" })
    }

    // Validate email domain
    if (!email.endsWith(".sherubtse@rub.edu.bt")) {
      errors.push({ msg: "Please use your institutional email (@rub.edu.bt)" })
    }

    // Detect role from email
    const role = detectRoleFromEmail(email)
    if (!role) {
      errors.push({ msg: "Invalid email format. Please use the correct institutional email format." })
    }

    if (errors.length > 0) {
      return res.render("auth/register", {
        title: "Register",
        errors,
        fullName,
        email,
        gender,
      })
    }

    // For demo purposes, we'll just create a user in the session
    // In a real app, you would save to a database
    req.session.user = {
      fullName,
      email,
      role,
      gender,
    }

    // Redirect to face registration page
    res.redirect("/register-face")
  } catch (err) {
    console.error("Registration error:", err)
    req.flash("error_msg", "An error occurred during registration")
    res.redirect("/register")
  }
}

// Login page
exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login" })
}

// Login handle
exports.postLogin = (req, res) => {
  try {
    const { email, password } = req.body

    // In a real app, you would validate credentials against your database
    // For this demo, we'll use a simple check

    // Determine role based on email pattern
    const role = detectRoleFromEmail(email)

    if (!role) {
      return res.render("auth/login", {
        title: "Login",
        error_msg: "Invalid email format. Please use your institutional email.",
      })
    }

    // Set user in session
    req.session.user = {
      email,
      role,
      fullName: email.split(".")[0], // Extract name from email for demo
    }

    // Redirect based on role
    if (role === "student") {
      res.redirect("/student/dashboard")
    } else if (role === "faculty") {
      res.redirect("/faculty/dashboard")
    } else if (role === "admin") {
      res.redirect("/admin/dashboard")
    } else {
      res.redirect("/")
    }
  } catch (err) {
    console.error("Login error:", err)
    req.flash("error_msg", "An error occurred during login")
    res.redirect("/login")
  }
}

// Logout handle
exports.logout = (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
    }
    res.redirect("/login")
  })
}

// Forgot password page
exports.getForgotPassword = (req, res) => {
  res.render("auth/forgot-password", { title: "Forgot Password" })
}

// Forgot password handle
exports.postForgotPassword = (req, res) => {
  // This would be implemented with email sending functionality
  req.flash("success_msg", "If your email exists in our system, you will receive password reset instructions")
  res.redirect("/login")
}

// Get all users (for admin)
exports.getAllUsers = (req, res) => {
  // In a real app, you would fetch users from your database
  // For this demo, we'll use mock data
  const users = [
    { id: 1, name: "John Smith", email: "12345.sherubtse@rub.edu.bt", role: "student" },
    { id: 2, name: "Jane Doe", email: "12346.sherubtse@rub.edu.bt", role: "student" },
    { id: 3, name: "Dr. Robert Johnson", email: "robert.sherubtse@rub.edu.bt", role: "faculty" },
    { id: 4, name: "Admin User", email: "admin123.sherubtse@rub.edu.bt", role: "admin" },
  ]

  res.render("admin/users", { title: "Users", users, active: "users" })
}
