'use client';

import { useState, useEffect } from 'react';
import { AddGradeModal } from '../../components/Modals';

interface Grade {
  id: string;
  subject: string;
  value: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Props {
  studentId: string;
}

export default function StudentClientPage({ studentId }: Props) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}/grades`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch grades');
      }
      const data = await response.json();
      setGrades(data.grades || []); // Ensure we always have an array
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [studentId]);

  const handleAddGrade = async (gradeData: { 
    subject: string; 
    value: number; 
    description?: string 
  }) => {
    try {
      const response = await fetch(
        `http://localhost:3002/students/${studentId}/grades`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(gradeData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add grade');
      }

      // Refresh grades after adding new one
      fetchGrades();
    } catch (error) {
      console.error('Error adding grade:', error);
    }
  };

  if (isLoading) {
    return <div>Loading grades...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Grades List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Grade
        </button>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No grades available. Click "Add New Grade" to add one.
        </div>
      ) : (
        <div className="grid gap-4">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{grade.subject}</h3>
                  <p className="text-gray-600">{grade.description}</p>
                </div>
                <span className="text-lg font-bold">{grade.value}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Added: {new Date(grade.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddGradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGrade={handleAddGrade}
      />
    </div>
  );
}