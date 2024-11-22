import { PrismaClient } from '@prisma/client'

class ExtendedPrismaClient extends PrismaClient {
  student: any
  grade: any
}

const database = new ExtendedPrismaClient()

export { database }