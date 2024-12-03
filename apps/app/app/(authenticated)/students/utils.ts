import { database } from '@repo/database';

export async function getStudentData(studentId: string) {
  try {
    const student = await database.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        // Include any other fields you need
      },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return { student };
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
}