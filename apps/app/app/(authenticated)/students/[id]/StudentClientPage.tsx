'use client';

import { useState, useEffect } from 'react';
import { AddGradeModal } from '../../components/Modals';
import { AlertDialog } from '../../components/Modals';
import { Pencil, Plus, Trash, TrendingUp, Clock, Trash2 } from 'lucide-react';
import { Progress } from "@repo/design-system/components/ui/progress";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { CircularProgress } from "@repo/design-system/components/ui/circular-progress";
interface Grade {
  id: string
  subject: string
  value: number
  description?: string
  createdAt: string
  updatedAt: string
  student: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Props {
  studentId: string;
}

export default function StudentClientPage({ studentId }: Props) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<Grade | null>(null);

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

const handleEditGrade = async (gradeData: {
  subject: string;
  value: number;
  description?: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}/grades/${gradeToEdit?.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(gradeData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update grade');
    }

    // Refresh grades after updating
    fetchGrades();
    setGradeToEdit(null);
    setIsEditModalOpen(false);
    setSelectedGrades([]);
  } catch (error) {
    console.error('Error updating grade:', error);
  }
};

    // Add helper function to handle edit button click
  const handleEditClick = () => {
    const selectedGrade = grades.find(grade => grade.id === selectedGrades[0]);
    setGradeToEdit(selectedGrade || null);
    setIsEditModalOpen(true);
  };

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

  const averageGrade = grades.length 
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : 0

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'text-green-500'
    if (value >= 70) return 'text-blue-500'
    if (value >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Grade Overview</h2>
          <p className="text-muted-foreground">Track and manage academic performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Grade
          </button>
          <button
            onClick={handleEditClick}
            disabled={selectedGrades.length !== 1}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={selectedGrades.length === 0}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedGrades.length > 0 && `(${selectedGrades.length})`}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <h3 className={`text-2xl font-bold ${getGradeColor(Number(averageGrade))}`}>
                  {averageGrade}%
                </h3>
              </div>
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                <h3 className="text-2xl font-bold">{grades.length}</h3>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latest Grade</p>
                <h3 className={`text-2xl font-bold ${
                  grades.length ? getGradeColor(grades[0]?.value) : ''
                }`}>
                  {grades.length ? `${grades[0]?.value}%` : 'N/A'}
                </h3>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Grid */}
      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[55vh] pr-4">
            {grades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground">No grades available</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary hover:underline mt-2"
                >
                  Add your first grade
                </button>
              </div>
            ) : (
              <div className="space-y-3">
{grades.map((grade) => (
  <div
    key={grade.id}
    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
      selectedGrades.includes(grade.id)
        ? 'border-primary bg-primary/5'
        : 'border-border'
    }`}
    onClick={() => {
      setSelectedGrades((prev) =>
        prev.includes(grade.id)
          ? prev.filter((id) => id !== grade.id)
          : [...prev, grade.id]
      )
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{grade.subject}</h3>
        {grade.description && (
          <p className="text-sm text-muted-foreground">{grade.description}</p>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          Added: {new Date(grade.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <CircularProgress value={grade.value} />
        <span className={`text-3xl font-bold ${getGradeColor(grade.value)}`}>
          {grade.value}%
        </span>
      </div>
    </div>
  </div>
))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Keep your existing modals */}
      <AddGradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGrade={handleAddGrade}
      />

      <AddGradeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setGradeToEdit(null)
          setSelectedGrades([])
        }}
        onAddGrade={handleEditGrade}
        initialData={gradeToEdit}
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
  )
}
