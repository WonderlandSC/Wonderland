"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CircularProgress } from "./ui/circular-progress"
import { TrendingUp, GraduationCap, Award } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion"
import { StudentProgressDashboardSkeleton } from "./loaders/student-progress-dashboard-skeleton"
import { useState } from "react"

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
  grades: Grade[]
  isLoading: boolean
}

type TimePeriod = "individual" | "week" | "month" | "quarter" | "year"

export function StudentProgressDashboard({ grades, isLoading }: Props) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("individual");

  if (isLoading) {
    return <StudentProgressDashboardSkeleton />
  }

  const averageGrade = grades.length 
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : 0

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'text-green-500'
    if (value >= 70) return 'text-blue-500'
    if (value >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const chartData = grades.map(grade => ({
    subject: grade.subject,
    value: grade.value,
  }))

  return (
    <div className="flex flex-col gap-6">
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
  )
}