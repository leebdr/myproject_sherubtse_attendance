class Course {
  // Find course by ID
  static async findById(id) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Check if course exists in mock data
      const course = mockCourses.find((c) => c.id === id)

      return course || null
    } catch (err) {
      console.error("Error finding course by ID:", err)
      throw err
    }
  }

  // Find courses by faculty
  static async findByFaculty(facultyId) {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll use a mock implementation

      // Filter courses by faculty ID
      const courses = mockCourses.filter((c) => c.facultyId === facultyId)

      return courses
    } catch (err) {
      console.error("Error finding courses by faculty:", err)
      throw err
    }
  }

  // Get all courses
  static async findAll() {
    try {
      // In a real implementation, this would query your database
      // For this example, we'll return mock data

      return mockCourses
    } catch (err) {
      console.error("Error finding all courses:", err)
      throw err
    }
  }

  // Create a new course
  static async create(courseData) {
    try {
      // In a real implementation, this would insert into your database
      // For this example, we'll add to our mock data

      // Add to mock data
      mockCourses.push({
        id: courseData.id,
        name: courseData.name,
        facultyId: courseData.facultyId,
        department: courseData.department,
        students: courseData.students || 0,
      })

      return true
    } catch (err) {
      console.error("Error creating course:", err)
      throw err
    }
  }

  // Update course
  static async update(courseId, updates) {
    try {
      // Find the course in mock data
      const courseIndex = mockCourses.findIndex((c) => c.id === courseId)

      if (courseIndex === -1) {
        throw new Error("Course not found")
      }

      // Update course
      mockCourses[courseIndex] = {
        ...mockCourses[courseIndex],
        ...updates,
      }

      return true
    } catch (err) {
      console.error("Error updating course:", err)
      throw err
    }
  }

  // Delete course
  static async delete(courseId) {
    try {
      // Find the course in mock data
      const courseIndex = mockCourses.findIndex((c) => c.id === courseId)

      if (courseIndex === -1) {
        throw new Error("Course not found")
      }

      // Remove from mock data
      mockCourses.splice(courseIndex, 1)

      return true
    } catch (err) {
      console.error("Error deleting course:", err)
      throw err
    }
  }
}

// Mock data for development
const mockCourses = [
  {
    id: "CSC101",
    name: "Introduction to Computer Science",
    facultyId: "3", // Dr. Robert Johnson
    department: "Computer Science",
    students: 45,
  },
  {
    id: "CSC202",
    name: "Data Structures and Algorithms",
    facultyId: "3", // Dr. Robert Johnson
    department: "Computer Science",
    students: 38,
  },
  {
    id: "MTH201",
    name: "Calculus II",
    facultyId: "3", // Dr. Robert Johnson
    department: "Mathematics",
    students: 52,
  },
  {
    id: "PHY102",
    name: "Physics for Engineers",
    facultyId: "3", // Dr. Robert Johnson
    department: "Physics",
    students: 41,
  },
]

module.exports = Course
