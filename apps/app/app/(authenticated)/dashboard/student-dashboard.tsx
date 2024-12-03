"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CircularProgress } from "@repo/design-system/components/ui/circular-progress";
import { TrendingUp, GraduationCap, Award } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@repo/design-system/components/ui/accordion";
import { StudentProgressDashboardSkeleton } from "@repo/design-system/components/loaders/student-progress-dashboard-skeleton";

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
  userId: string;
}

type TimePeriod = "individual" | "week" | "month" | "quarter" | "year";

export function StudentProgressDashboard({ userId }: Props) {
  const { getToken, isLoaded } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("individual");

  useEffect(() => {
    if (!isLoaded) return; // Don't fetch until auth is loaded

    const fetchGrades = async () => {
      try {
        setError(null);
        const token = await getToken();

        if (!token) {
          setError('Authentication token not available!');
          return;
        }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${userId}/grades`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Response error:', errorData);
      throw new Error(`Failed to fetch grades: ${errorData}`);
    }

        const data = await response.json();
        setGrades(data.grades);

  } catch (error) {
    console.error('[ERROR] Full error details:', error);
    setError(error instanceof Error ? error.message : 'Failed to fetch grades');
  }
};

    fetchGrades();
  }, [userId, getToken, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const averageGrade = grades.length 
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : 0;

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-blue-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const chartData = grades.map(grade => ({
    subject: grade.subject,
    value: grade.value,
  }));

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">Track your academic performance</p>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="individual" onClick={() => setTimePeriod("individual")}>
            Individual
          </TabsTrigger>
          <TabsTrigger value="week" onClick={() => setTimePeriod("week")}>
            Week
          </TabsTrigger>
          <TabsTrigger value="month" onClick={() => setTimePeriod("month")}>
            Month
          </TabsTrigger>
          <TabsTrigger value="quarter" onClick={() => setTimePeriod("quarter")}>
            Quarter
          </TabsTrigger>
          <TabsTrigger value="year" onClick={() => setTimePeriod("year")}>
            Year
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <h3 className="text-2xl font-bold">{grades.length}</h3>
              </div>
              <GraduationCap className="h-6 w-6 text-muted-foreground" />
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
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Grade Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[490px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="subject" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <p className="text-sm text-muted-foreground">
              You have {grades.length} grades this semester
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[460px] pr-4">
              {grades.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">No grades available</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {grades.map((grade) => (
                    <AccordionItem key={grade.id} value={grade.id}>
                      <AccordionTrigger className="flex items-center cursor-pointer">
                        <CircularProgress 
                          value={grade.value} 
                          size={40} 
                          strokeWidth={4}
                          className="mr-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none truncate">
                            {grade.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(grade.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-lg font-bold ${getGradeColor(grade.value)}`}>
                          {grade.value}%
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {grade.description}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}