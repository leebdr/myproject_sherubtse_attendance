const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const dotenv = require("dotenv")
const methodOverride = require("method-override")

// Load environment variables
dotenv.config()

// Import routes
const routes = require("./routes")

// Initialize app
const app = express()

// View engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: false, limit: "50mb" }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sherubtse-attendance-secret",
    resave: false,
    saveUninitialized: true, // Changed to true to ensure session is always created
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Flash messages
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.session.user || null
  next()
})

// Routes
app.use("/", routes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", {
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
