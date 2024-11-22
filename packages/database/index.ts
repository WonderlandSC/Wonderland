import { PrismaClient } from '@prisma/client'

class ExtendedPrismaClient extends PrismaClient {
  get student() {
    return this.student.findMany(); // Fetch all students
  }
  
  set student(value: any) {
    // Assuming value is an object with student details
    this.student.create({ data: value }); // Create a new student
  }

  get grade() {
    return this.grade.findMany(); // Fetch all grades
  }
  
  set grade(value: any) {
    // Assuming value is an object with grade details
    this.grade.create({ data: value }); // Create a new grade
  }
}

const database = new ExtendedPrismaClient()

export { database }