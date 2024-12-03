"use client";

interface Props {
  userId: string;
}

export function TeacherDashboard({ userId }: Props) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your classes and student progress</p>
      </div>
      
      {/* Add your teacher dashboard components here */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h2 className="font-semibold">Classes Overview</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="font-semibold">Recent Assignments</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="font-semibold">Student Performance</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}