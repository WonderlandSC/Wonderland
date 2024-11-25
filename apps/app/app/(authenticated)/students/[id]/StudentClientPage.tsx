'use client';

import { useState, useEffect } from 'react';
import { AddGradeModal } from '../../components/Modals';
import { AlertDialog } from '../../components/Modals';

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

  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}/grades`, // Use environment variable
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

  const handleDeleteGrades = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}/grades`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ gradeIds: selectedGrades }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete grades');
    }

    // Refresh grades and clear selection
    setSelectedGrades([]);
    fetchGrades();
    setIsDeleteDialogOpen(false);
  } catch (error) {
    console.error('Error deleting grades:', error);
  }
};

return (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Grades List</h2>
      <div className="space-x-2">
        {selectedGrades.length > 0 && (
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Selected ({selectedGrades.length})
          </button>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Grade
        </button>
      </div>
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
            className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              selectedGrades.includes(grade.id) ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => {
              setSelectedGrades((prev) =>
                prev.includes(grade.id)
                  ? prev.filter((id) => id !== grade.id)
                  : [...prev, grade.id]
              );
            }}
            role="checkbox"
            aria-checked={selectedGrades.includes(grade.id)}
            tabIndex={0}
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

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteGrades}
        title="Delete Grades"
        description={`Are you sure you want to delete ${selectedGrades.length} selected grade${
        selectedGrades.length === 1 ? '' : 's'
      }? This action cannot be undone.`}
    />
    </div>
  );
}