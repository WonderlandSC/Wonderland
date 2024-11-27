"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/design-system/components/ui/dialog"
import { Button } from "@repo/design-system/components/ui/button"
import { Checkbox } from "@repo/design-system/components/ui/checkbox"
import { useToast } from "@repo/design-system/components/ui/use-toast"

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface RemoveStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  students: Student[];
  onRemoveStudents: (studentIds: string[]) => void;
}

export function RemoveStudentModal({ isOpen, onClose, groupId, students, onRemoveStudents }: RemoveStudentModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { toast } = useToast();

const handleRemoveStudents = async () => {
  try {
    console.log('Removing studentIds:', selectedStudents); // Debug log
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/students`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentIds: selectedStudents }),
      credentials: 'include'
    });

    console.log('Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response:', data); // Debug log
      throw new Error(data.error || 'Failed to remove students from group');
    }

    console.log('Response data:', data); // Debug log
    onRemoveStudents(selectedStudents);
    toast({
      title: "Success",
      description: `Removed ${selectedStudents.length} student(s) from the group.`,
    });
    setSelectedStudents([]); // Clear selections after success
    onClose();
  } catch (error) {
    console.error('Error removing students from group:', error);
    toast({
      title: "Error",
      description: "Failed to remove students from group. Please try again.",
      variant: "destructive",
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Students from Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {students.map((student) => (
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
          <Button onClick={handleRemoveStudents} disabled={selectedStudents.length === 0}>
            Remove {selectedStudents.length} Student(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}