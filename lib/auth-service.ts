// This is a mock service for authentication
// In a real implementation, this would connect to your backend API

interface RegisterUserParams {
  fullName: string
  email: string
  password: string
  role: string
}

interface AuthResult {
  success: boolean
  message?: string
  role?: string
  userId?: string
}

// List of known admin email prefixes
const knownAdminPrefixes = ["admin", "admin123", "sysadmin", "techadmin", "sysadmin2023"]

export async function registerUser(params: RegisterUserParams): Promise<AuthResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // In a real implementation, this would send a request to your backend
    console.log("Registering user:", params)

    // Double-check role based on email pattern for security
    const email = params.email.toLowerCase()
    const prefix = email.split(".sherubtse@rub.edu.bt")[0]

    let detectedRole = ""

    // Check for admin emails first
    if (knownAdminPrefixes.includes(prefix)) {
      detectedRole = "admin"
    }
    // Check for student emails (numbers only)
    else if (/^\d+$/.test(prefix)) {
      detectedRole = "student"
    }
    // Check for faculty emails (letters only)
    else if (/^[a-zA-Z]+$/.test(prefix)) {
      detectedRole = "faculty"
    }
    // Mixed alphanumeric but not in admin list
    else if (/^[a-zA-Z0-9]+$/.test(prefix)) {
      detectedRole = "faculty" // Default to faculty for security
    } else {
      return {
        success: false,
        message: "Invalid email format. Please use your institutional email.",
      }
    }

    // For security, ensure the role matches what we detected
    // This prevents someone from submitting a different role than their email indicates
    if (detectedRole !== params.role) {
      console.warn(`Role mismatch: email indicates ${detectedRole} but user claimed ${params.role}`)
      // We'll use the detected role instead of what was submitted
      params.role = detectedRole
    }

    // Store user role in localStorage for demo purposes
    // In a real app, this would be handled by your authentication system
    localStorage.setItem("userRole", params.role)

    return {
      success: true,
      role: params.role,
      userId: "user_" + Math.random().toString(36).substr(2, 9),
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "Failed to register user. Please try again.",
    }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // In a real implementation, this would send a request to your backend
    console.log("Logging in user:", email)

    // Determine role based on email pattern
    const emailLower = email.toLowerCase()
    const prefix = emailLower.split(".sherubtse@rub.edu.bt")[0]

    let role = ""

    // Check for admin emails first
    if (knownAdminPrefixes.includes(prefix)) {
      role = "admin"
    }
    // Check for student emails (numbers only)
    else if (/^\d+$/.test(prefix)) {
      role = "student"
    }
    // Check for faculty emails (letters only)
    else if (/^[a-zA-Z]+$/.test(prefix)) {
      role = "faculty"
    }
    // Mixed alphanumeric but not in admin list
    else if (/^[a-zA-Z0-9]+$/.test(prefix)) {
      role = "faculty" // Default to faculty for security
    } else {
      return {
        success: false,
        message: "Invalid email format. Please use your institutional email.",
      }
    }

    // Store user role in localStorage for demo purposes
    // In a real app, this would be handled by your authentication system
    localStorage.setItem("userRole", role)

    return {
      success: true,
      role,
      userId: "user_" + Math.random().toString(36).substr(2, 9),
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Failed to log in. Please check your credentials and try again.",
    }
  }
}

export async function logoutUser(): Promise<AuthResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Clear local storage
    localStorage.removeItem("userRole")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Logout error:", error)
    return {
      success: false,
      message: "Failed to log out. Please try again.",
    }
  }
}
