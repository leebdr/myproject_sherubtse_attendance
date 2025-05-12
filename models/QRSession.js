const { v4: uuidv4 } = require("uuid")

class QRSession {
  // Find QR session by ID
  static async findById(id) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Check if session exists in mock data
      const session = mockSessions.find((s) => s.id === id)

      return session || null
    } catch (err) {
      console.error("Error finding QR session by ID:", err)
      throw err
    }
  }

  // Find QR sessions by course and faculty
  static async findByCourseAndFaculty(courseId, facultyId) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Filter sessions by course ID and faculty ID
      const sessions = mockSessions.filter((s) => s.courseId === courseId && s.facultyId === facultyId)

      return sessions
    } catch (err) {
      console.error("Error finding QR sessions by course and faculty:", err)
      throw err
    }
  }

  // Create new QR session
  static async create(sessionData) {
    try {
      // In a real implementation, this would insert into your database
      // For this example, we'll use a mock implementation

      const id = uuidv4()

      // Create new session object
      const newSession = {
        id,
        courseId: sessionData.courseId,
        facultyId: sessionData.facultyId,
        courseName: sessionData.courseName,
        facultyName: sessionData.facultyName,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
        location: sessionData.location,
      }

      // Add to mock data
      mockSessions.push(newSession)

      return newSession
    } catch (err) {
      console.error("Error creating QR session:", err)
      throw err
    }
  }

  // Get all sessions
  static async findAll() {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll return mock data
      return mockSessions
    } catch (err) {
      console.error("Error finding all QR sessions:", err)
      throw err
    }
  }

  // Clean up expired sessions
  static async cleanupExpired() {
    try {
      // In a real implementation, this would delete from your database
      // For this example, we'll filter out expired sessions from mock data

      const now = new Date()
      const initialCount = mockSessions.length

      // Remove expired sessions
      mockSessions = mockSessions.filter((session) => new Date(session.expiresAt) > now)

      const removedCount = initialCount - mockSessions.length

      return { removedCount }
    } catch (err) {
      console.error("Error cleaning up expired QR sessions:", err)
      throw err
    }
  }
}

// Mock data for development
let mockSessions = [
  {
    id: "session1",
    courseId: "CSC101",
    facultyId: "3",
    courseName: "Introduction to Computer Science",
    facultyName: "Dr. Robert Johnson",
    createdAt: new Date(2023, 4, 1, 9, 0),
    expiresAt: new Date(2023, 4, 1, 9, 15),
    location: {
      latitude: 27.123456,
      longitude: 90.123456,
    },
  },
  {
    id: "session2",
    courseId: "MTH201",
    facultyId: "3",
    courseName: "Calculus II",
    facultyName: "Dr. Robert Johnson",
    createdAt: new Date(2023, 4, 2, 11, 0),
    expiresAt: new Date(2023, 4, 2, 11, 15),
    location: {
      latitude: 27.123457,
      longitude: 90.123457,
    },
  },
  {
    id: "session3",
    courseId: "PHY102",
    facultyId: "3",
    courseName: "Physics for Engineers",
    facultyName: "Dr. Robert Johnson",
    createdAt: new Date(2023, 4, 3, 14, 0),
    expiresAt: new Date(2023, 4, 3, 14, 15),
    location: {
      latitude: 27.123458,
      longitude: 90.123458,
    },
  },
]

module.exports = QRSession
