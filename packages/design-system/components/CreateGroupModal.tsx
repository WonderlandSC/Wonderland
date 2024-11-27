"use client"
import { Calendar } from "@repo/design-system/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover"
import { cn } from "@repo/design-system/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog"
import { Label } from "@repo/design-system/components/ui/label"
import { Input } from "@repo/design-system/components/ui/input"
import { Button } from "@repo/design-system/components/ui/button"

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: {
    name: string;
    description: string;
    regularPrice: number;
    earlyBirdPrice: number;
    earlyBirdDeadline: Date;
    schedule: string;
  }) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState(0);
  const [earlyBirdPrice, setEarlyBirdPrice] = useState(0);
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState("");

  const handleSubmit = () => {
    if (earlyBirdDeadline) {
      onCreateGroup({
        name,
        description,
        regularPrice,
        earlyBirdPrice,
        earlyBirdDeadline,
        schedule,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Add a new group with its details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="regularPrice" className="text-right">
              Regular Price
            </Label>
            <Input
              id="regularPrice"
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="earlyBirdPrice" className="text-right">
              Early Bird Price
            </Label>
            <Input
              id="earlyBirdPrice"
              type="number"
              value={earlyBirdPrice}
              onChange={(e) => setEarlyBirdPrice(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="earlyBirdDeadline" className="text-right">
              Early Bird Deadline
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !earlyBirdDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {earlyBirdDeadline ? format(earlyBirdDeadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={earlyBirdDeadline}
                  onSelect={setEarlyBirdDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule" className="text-right">
              Schedule
            </Label>
            <Input
              id="schedule"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

