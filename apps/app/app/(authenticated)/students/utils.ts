import { database } from '@repo/database';

export async function getStudentData(id: string) {
  try {
    const student = await database.student.findUnique({
      where: { id },
      include: {
        grades: true,
      },
    });

    return { student };
  } catch (error) {
    console.error('Error fetching student:', error);
    return { student: null };
  }
}