'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { CircularProgress } from "@repo/design-system/components/ui/circular-progress";
import { TrendingUp, Clock } from 'lucide-react';

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

export default function StudentGradesView({ studentId }: Props) {
  const [grades, setGrades] = useState<Grade[]>([]);
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
      setGrades(data.grades || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [studentId]);

  const averageGrade = grades.length 
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : 0;

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-blue-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return <div>Loading grades...</div>;
  }

  return (
    <div className="space-y-4">
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

      {/* Grades List */}
      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[55vh] pr-4">
            {grades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground">No grades available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    className="p-4 rounded-lg border border-border"
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
    </div>
  );
}