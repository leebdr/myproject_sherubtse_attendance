const { v4: uuidv4 } = require("uuid")

class Attendance {
  // Find attendance by session and student
  static async findBySessionAndStudent(sessionId, studentId) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Check if attendance record exists in mock data
      const attendance = mockAttendance.find((a) => a.sessionId === sessionId && a.studentId === studentId)

      return attendance || null
    } catch (err) {
      console.error("Error finding attendance by session and student:", err)
      throw err
    }
  }

  // Create new attendance record
  static async create(attendanceData) {
    try {
      // In a real implementation, this would insert into your database
      // For this example, we'll use a mock implementation

      const id = uuidv4()

      // Create new attendance object
      const newAttendance = {
        id,
        sessionId: attendanceData.sessionId,
        studentId: attendanceData.studentId,
        courseId: attendanceData.courseId,
        timestamp: attendanceData.timestamp,
        location: attendanceData.location,
        faceScore: attendanceData.faceScore,
        status: attendanceData.status,
      }

      // Add to mock data
      mockAttendance.push(newAttendance)

      return id
    } catch (err) {
      console.error("Error creating attendance record:", err)
      throw err
    }
  }

  // Find attendance records by session IDs
  static async findBySessionIds(sessionIds) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll filter mock data
      return mockAttendance.filter((record) => sessionIds.includes(record.sessionId))
    } catch (err) {
      console.error("Error finding attendance by session IDs:", err)
      throw err
    }
  }

  // Find attendance records by student
  static async findByStudent(studentId) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Filter attendance records by student ID
      const attendance = mockAttendance.filter((a) => a.studentId === studentId)

      return attendance
    } catch (err) {
      console.error("Error finding attendance by student:", err)
      throw err
    }
  }

  // Get all attendance records
  static async findAll() {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll return mock data
      return mockAttendance
    } catch (err) {
      console.error("Error finding all attendance records:", err)
      throw err
    }
  }

  // Find attendance by course ID
  static async findByCourse(courseId) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll filter mock data
      return mockAttendance.filter((record) => record.courseId === courseId)
    } catch (err) {
      console.error("Error finding attendance by course ID:", err)
      throw err
    }
  }

  // Find attendance by date range
  static async findByDateRange(startDate, endDate) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll filter mock data
      return mockAttendance.filter((record) => {
        const recordDate = new Date(record.timestamp)
        return recordDate >= startDate && recordDate <= endDate
      })
    } catch (err) {
      console.error("Error finding attendance by date range:", err)
      throw err
    }
  }
}

// Add mock attendance data if it doesn't exist
const mockAttendance = [
  {
    id: "1",
    sessionId: "session1",
    studentId: "1",
    courseId: "CSC101",
    timestamp: new Date(2023, 4, 1, 9, 15),
    location: { latitude: 27.123456, longitude: 90.123456 },
    faceScore: 0.95,
    status: "present",
  },
  {
    id: "2",
    sessionId: "session1",
    studentId: "2",
    courseId: "CSC101",
    timestamp: new Date(2023, 4, 1, 9, 18),
    location: { latitude: 27.123457, longitude: 90.123457 },
    faceScore: 0.92,
    status: "present",
  },
  {
    id: "3",
    sessionId: "session2",
    studentId: "1",
    courseId: "MTH201",
    timestamp: new Date(2023, 4, 2, 11, 5),
    location: { latitude: 27.123458, longitude: 90.123458 },
    faceScore: 0.96,
    status: "present",
  },
  {
    id: "4",
    sessionId: "session3",
    studentId: "2",
    courseId: "PHY102",
    timestamp: new Date(2023, 4, 3, 14, 10),
    location: { latitude: 27.123459, longitude: 90.123459 },
    faceScore: 0.91,
    status: "present",
  },
]

module.exports = Attendance
