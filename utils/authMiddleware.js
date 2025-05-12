/**
 * Middleware to ensure user is authenticated
 */
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next()
  }

  if (req.session && req.session.user) {
    // For compatibility with session-based auth
    req.user = req.session.user
    return next()
  }

  req.flash("error_msg", "Please log in to access this page")
  res.redirect("/login")
}

/**
 * Middleware to ensure user has the required role
 * @param {string|string[]} roles - Required role(s)
 */
exports.ensureRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated && !req.session) {
      req.flash("error_msg", "Please log in to access this page")
      return res.redirect("/login")
    }

    // Get user from either passport or session
    const user = req.user || req.session.user

    if (!user) {
      req.flash("error_msg", "Please log in to access this page")
      return res.redirect("/login")
    }

    const userRole = user.role

    // Check if user has one of the required roles
    const requiredRoles = Array.isArray(roles) ? roles : [roles]

    if (requiredRoles.includes(userRole)) {
      return next()
    }

    req.flash("error_msg", "You do not have permission to access this page")

    // Redirect to appropriate dashboard based on role
    if (userRole === "student") {
      return res.redirect("/student/dashboard")
    } else if (userRole === "faculty") {
      return res.redirect("/faculty/dashboard")
    } else if (userRole === "admin") {
      return res.redirect("/admin/dashboard")
    } else {
      return res.redirect("/")
    }
  }
}

// Middleware to ensure user is authenticated as faculty
exports.ensureFaculty = (req, res, next) => {
  if (
    (req.isAuthenticated && req.isAuthenticated() && req.user.role === "faculty") ||
    (req.session && req.session.user && req.session.user.role === "faculty")
  ) {
    return next()
  }
  req.flash("error_msg", "Please log in as faculty to access this resource")
  res.redirect("/login")
}

// Middleware to ensure user is authenticated as student
exports.ensureStudent = (req, res, next) => {
  if (
    (req.isAuthenticated && req.isAuthenticated() && req.user.role === "student") ||
    (req.session && req.session.user && req.session.user.role === "student")
  ) {
    return next()
  }
  req.flash("error_msg", "Please log in as student to access this resource")
  res.redirect("/login")
}

// Middleware to ensure user is authenticated as admin
exports.ensureAdmin = (req, res, next) => {
  if (
    (req.isAuthenticated && req.isAuthenticated() && req.user.role === "admin") ||
    (req.session && req.session.user && req.session.user.role === "admin")
  ) {
    return next()
  }
  req.flash("error_msg", "Please log in as admin to access this resource")
  res.redirect("/login")
}
