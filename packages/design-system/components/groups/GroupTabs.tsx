"use client"

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/design-system/components/ui/tabs"
import { Button } from "@repo/design-system/components/ui/button"
import { useToast } from "@repo/design-system/components/ui/use-toast"
import { PlusIcon, MinusIcon } from "lucide-react"
import { AddStudentModal } from './AddStudentModal'
import { RemoveStudentModal } from './RemoveStudentModal'
import { Separator } from '@repo/design-system/components/ui/separator';

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
    setGroups(data.groups.reverse()); // Reversing the groups array
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
    <div>
      <Tabs value={selectedGroup || undefined} onValueChange={setSelectedGroup}>
        <div className="flex justify-between items-center mb-4">
<TabsList className=""> {/* Use grid layout with 4 columns */}
  {groups.map((group) => (
    <div key={group.id}>
      <TabsTrigger value={group.id}>
        {group.name}
      </TabsTrigger>
    </div>
  ))}
</TabsList>
          <div className="space-x-2">
            <Button onClick={handleAddStudent} variant="outline">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button onClick={handleRemoveStudent} variant="outline">
              <MinusIcon className="h-4 w-4 mr-2" />
              Remove Student
            </Button>
          </div>
        </div>
        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <h2 className="text-xl font-bold mb-4">Students in {group.name}</h2>
            {students.length > 0 ? (
              <ul className="space-y-2">
                {students.map((student) => (
                  <li key={student.id} className="p-2 bg-secondary rounded-lg">
                    {student.firstName} {student.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students in this group.</p>
            )}
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