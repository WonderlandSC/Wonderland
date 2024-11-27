"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/design-system/components/ui/dialog"
import { Button } from "@repo/design-system/components/ui/button"
import { Checkbox } from "@repo/design-system/components/ui/checkbox"
import { useToast } from "@repo/design-system/components/ui/use-toast"

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  onAddStudents: (students: Student[]) => void;
}

export function AddStudentModal({ isOpen, onClose, groupId, onAddStudents }: AddStudentModalProps) {
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && groupId) {
      fetchAvailableStudents();
    }
  }, [isOpen, groupId]);

const fetchAvailableStudents = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students?excludeGroup=${groupId}`);
    if (!response.ok) throw new Error('Failed to fetch available students');
    const data = await response.json();
    setAvailableStudents(data.students);
  } catch (error) {
    console.error('Error fetching available students:', error);
    toast({
      title: "Error",
      description: "Failed to fetch available students. Please try again.",
      variant: "destructive",
    });
  }
};

const handleAddStudents = async () => {
  try {
    console.log('Sending studentIds:', selectedStudents); // Debug log
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/students`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentIds: selectedStudents }),
      credentials: 'include',
    });

    console.log('Response status:', response.status); // Debug log

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response:', data); // Debug log
      throw new Error(data.error || 'Failed to add students to group');
    }

    console.log('Response data:', data); // Debug log
    onAddStudents(data.addedStudents);
    toast({
      title: "Success",
      description: `Added ${selectedStudents.length} student(s) to the group.`,
    });
    setSelectedStudents([]); // Clear selections after success
    onClose();
  } catch (error) {
    console.error('Error adding students to group:', error);
    toast({
      title: "Error",
      description: "Failed to add students to group. Please try again.",
      variant: "destructive",
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Students to Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {availableStudents.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <Checkbox
                id={student.id}
                checked={selectedStudents.includes(student.id)}
                onCheckedChange={(checked) => {
                  setSelectedStudents(
                    checked
                      ? [...selectedStudents, student.id]
                      : selectedStudents.filter((id) => id !== student.id)
                  );
                }}
              />
              <label htmlFor={student.id}>
                {student.firstName} {student.lastName}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleAddStudents} disabled={selectedStudents.length === 0}>
            Add {selectedStudents.length} Student(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}