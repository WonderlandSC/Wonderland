"use client"

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/design-system/components/ui/tabs"
import { Button } from "@repo/design-system/components/ui/button"
import { useToast } from "@repo/design-system/components/ui/use-toast"
import { PlusIcon, MinusIcon } from 'lucide-react'
import { AddStudentModal } from './AddStudentModal'
import { RemoveStudentModal } from './RemoveStudentModal'
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area"

interface Group {
  id: string;
  name: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

export function GroupTabs() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudentsInGroup(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups.reverse());
      if (data.groups.length > 0) setSelectedGroup(data.groups[0].id);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch groups. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleRemoveStudent = () => {
    setIsRemoveModalOpen(true);
  };

  const fetchStudentsInGroup = async (groupId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={selectedGroup || undefined} onValueChange={setSelectedGroup}>
        <div className="flex flex-col space-y-4  ">
          <ScrollArea className="w-full sm:w-auto">
            <TabsList className="h-auto flex-wrap justify-start">
              {groups.map((group, index) => (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className={`flex-grow-0 ${index % 5 === 0 ? 'sm:ml-0' : ''}`}
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          <div className="flex space-x-2">
            <Button onClick={handleAddStudent} variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button onClick={handleRemoveStudent} variant="outline" size="sm">
              <MinusIcon className="h-4 w-4 mr-2" />
              Remove Student
            </Button>
          </div>
        </div>
        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <div className="bg-card text-card-foreground rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Students in {group.name}</h2>
              {students.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <li key={student.id} className="p-3 bg-secondary rounded-lg shadow">
                      {student.firstName} {student.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No students in this group.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        groupId={selectedGroup}
        onAddStudents={(addedStudents) => {
          setStudents([...students, ...addedStudents]);
          setIsAddModalOpen(false);
        }}
      />
      <RemoveStudentModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        groupId={selectedGroup}
        students={students}
        onRemoveStudents={(removedStudentIds) => {
          setStudents(students.filter(s => !removedStudentIds.includes(s.id)));
          setIsRemoveModalOpen(false);
        }}
      />
    </div>
  );
}

