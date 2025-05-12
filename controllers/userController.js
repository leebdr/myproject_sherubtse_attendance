const User = require("../models/User")
const fs = require("fs")
const path = require("path")
const multer = require("multer")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads/profiles")
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Use user ID and timestamp to create unique filename
    const userId = req.user.id
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `${userId}_${timestamp}${ext}`)
  },
})

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Not an image! Please upload only images."), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
})

// Upload profile photo
exports.uploadProfilePhoto = [
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" })
      }

      // Get the file path relative to public directory
      const relativePath = `/uploads/profiles/${req.file.filename}`

      // Update user's profile photo in database
      await User.updateProfilePhoto(req.user.id, relativePath)

      return res.status(200).json({
        success: true,
        message: "Profile photo updated successfully",
        photoUrl: relativePath,
      })
    } catch (error) {
      console.error("Error uploading profile photo:", error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading the profile photo",
      })
    }
  },
]

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Remove sensitive information
    const { password, ...userProfile } = user

    return res.status(200).json({
      success: true,
      user: userProfile,
    })
  } catch (error) {
    console.error("Error getting user profile:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting the user profile",
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body

    // Prevent updating sensitive fields
    delete updates.password
    delete updates.email
    delete updates.role

    // Update user in database
    const updated = await User.updateProfile(req.user.id, updates)

    if (!updated) {
      return res.status(400).json({ success: false, message: "Failed to update profile" })
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    })
  }
}
