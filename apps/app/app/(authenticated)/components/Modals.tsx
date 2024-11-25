import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";

import {
  AlertDialog as AlertDialogUI,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design-system/components/ui/alert-dialog";

import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { useEffect, useState } from "react"; // Import useState

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGrade: (gradeData: { subject: string; value: number; description?: string }) => void;
  initialData?: {
    subject: string;
    value: number;
    description?: string;
  } | null;
}

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function AddGradeModal({ isOpen, onClose, onAddGrade, initialData }: AddGradeModalProps) {
  // State for input fields
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [value, setValue] = useState(initialData?.value || 0);
  const [description, setDescription] = useState(initialData?.description || "");

  const handleAddGrade = () => {
    onAddGrade({ subject, value, description }); // Pass the state values to onAddGrade
    setSubject(""); // Reset the subject input
    setValue(0); // Reset the value input
    setDescription(""); // Reset the description input
    onClose(); // Close the modal
  };

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setValue(initialData.value);
      setDescription(initialData.description || "");
    } else {
      setSubject("");
      setValue(0);
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    onAddGrade({ subject, value, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Add Grade</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Grade' : 'Add Grade'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edit the grade details.' : 'Add a new grade for the student.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)} // Update state on change
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade
            </Label>
            <Input
              id="grade"
              type="number" // Ensure this is a number input
              value={value}
              onChange={(e) => setValue(Number(e.target.value))} // Update state on change
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Update state on change
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Grade'}
          </Button>        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AlertDialog({ isOpen, onClose, onConfirm, title, description }: AlertDialogProps) {
  return (
    <AlertDialogUI open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogUI>
  );
}