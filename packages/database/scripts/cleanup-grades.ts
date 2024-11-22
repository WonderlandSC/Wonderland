import { database } from '../index';

async function cleanupOrphanedGrades() {
  try {
    console.log('Starting cleanup of all grades...');

    const deleted = await database.grade.deleteMany({});

    console.log(`Successfully deleted ${deleted.count} grades`);
  } catch (error) {
    console.error('Error cleaning up grades:', error);
  } finally {
    await database.$disconnect();
  }
}

// Run the cleanup
cleanupOrphanedGrades();