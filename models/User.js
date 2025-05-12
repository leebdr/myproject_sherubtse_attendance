const db = require("../utils/db")
const { v4: uuidv4 } = require("uuid")

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Check if user exists in mock data
      const user = mockUsers.find((u) => u.email === email)

      return user || null
    } catch (err) {
      console.error("Error finding user by email:", err)
      throw err
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Check if user exists in mock data
      const user = mockUsers.find((u) => u.id === id)

      return user || null
    } catch (err) {
      console.error("Error finding user by ID:", err)
      throw err
    }
  }

  // Find multiple users by IDs
  static async findByIds(ids) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Filter users by IDs
      const users = mockUsers.filter((u) => ids.includes(u.id))

      return users
    } catch (err) {
      console.error("Error finding users by IDs:", err)
      throw err
    }
  }

  // Create new user
  static async create(userData) {
    try {
      // In a real implementation, this would insert into your database
      // For this example, we'll use a mock implementation

      const id = uuidv4()

      // Create new user object
      const newUser = {
        id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        gender: userData.gender,
        // Add conditional fields based on role
        ...(userData.role === "student" && {
          studentId: userData.studentId,
          hostel: userData.hostel,
          department: userData.department,
          course: userData.course,
          year: userData.year,
        }),
        ...(userData.role !== "student" && {
          profession: userData.profession,
        }),
        faceRegistered: false,
        faceImagePath: null,
        profilePhoto: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Add to mock data
      mockUsers.push(newUser)

      return id
    } catch (err) {
      console.error("Error creating user:", err)
      throw err
    }
  }

  // Update user's face data
  static async updateFaceData(userId, faceData) {
    try {
      // In a real implementation, this would update your database
      // For this example, we'll use a mock implementation

      // Find user in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Update user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        faceRegistered: faceData.faceRegistered,
        faceImagePath: faceData.faceImagePath,
        updatedAt: new Date(),
      }

      return true
    } catch (err) {
      console.error("Error updating user face data:", err)
      throw err
    }
  }

  // Get all users (for admin)
  static async findAll() {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll return mock data

      // Return all users (excluding password)
      return mockUsers.map((user) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
    } catch (err) {
      console.error("Error finding all users:", err)
      throw err
    }
  }

  // Update user's profile photo
  static async updateProfilePhoto(userId, photoPath) {
    try {
      // In a real implementation, this would update your database
      // For this example, we'll use a mock implementation

      // Find user in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Update user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        profilePhoto: photoPath,
        updatedAt: new Date(),
      }

      return true
    } catch (err) {
      console.error("Error updating user profile photo:", err)
      throw err
    }
  }

  // Update user profile
  static async updateProfile(userId, updates) {
    try {
      // In a real implementation, this would update your database
      // For this example, we'll use a mock implementation

      // Find user in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Update user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date(),
      }

      return true
    } catch (err) {
      console.error("Error updating user profile:", err)
      throw err
    }
  }

  // Check if email is admin
  static isAdminEmail(email) {
    // In a real implementation, this would query your database
    // For this example, we'll check against our mock data and pattern

    // Check if email matches admin pattern and exists in our admin list
    const isAdminPattern = email.match(/^[a-zA-Z0-9]+\.sherubtse@rub\.edu\.bt$/)
    if (!isAdminPattern) return false

    return mockUsers.some((user) => user.email === email && user.role === "admin")
  }

  // Update user status
  static async updateStatus(userId, status) {
    try {
      // Find user in mock data
      const userIndex = mockUsers.findIndex((u) => u.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Update user status
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        status: status,
        updatedAt: new Date(),
      }

      return true
    } catch (err) {
      console.error("Error updating user status:", err)
      throw err
    }
  }
}

// Mock data for development
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "12345.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "student",
    studentId: "12345",
    gender: "male",
    hostel: "Thubtenling",
    department: "DOPS",
    course: "BSc in Physics",
    year: "2",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/1_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-student.jpg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "12346.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "student",
    studentId: "12346",
    gender: "female",
    hostel: "Pemaling",
    department: "DOELS",
    course: "BSc in Environmental Science",
    year: "3",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/2_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-student.jpg",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "3",
    name: "Dr. Robert Johnson",
    email: "robert.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "faculty",
    gender: "male",
    profession: "Lecturer",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/3_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-faculty.jpg",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "admin",
    gender: "male",
    profession: "President",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/4_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-admin.jpg",
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-01-04"),
  },
  {
    id: "5",
    name: "Admin Tech Support",
    email: "admin123.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "admin",
    gender: "female",
    profession: "IT Administrator",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/5_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-admin.jpg",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
  },
  {
    id: "6",
    name: "System Administrator",
    email: "sysadmin2023.sherubtse@rub.edu.bt",
    password: "$2a$10$X7VYHy.uAz7o7lEZU8/9m.oPTv4g1jMlB6x.AaLzVfVJ0k2C5Ctxq", // 'password'
    role: "admin",
    gender: "male",
    profession: "System Administrator",
    faceRegistered: true,
    faceImagePath: "/uploads/faces/6_1620000000000.jpg",
    profilePhoto: "/uploads/profiles/default-admin.jpg",
    createdAt: new Date("2023-01-06"),
    updatedAt: new Date("2023-01-06"),
  },
]

module.exports = User
