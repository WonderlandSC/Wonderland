import { SyncStudentsButton } from '../components/sync-students';
import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';

export default function StudentsPage() {


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <SyncStudentsButton />
      </div>
      
      {/* Rest of your students list UI */}
    </div>
  );
}