import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/design-system/components/ui/dialog"
import { Button } from "@repo/design-system/components/ui/button"
import { Input } from "@repo/design-system/components/ui/input"
import { Textarea } from "@repo/design-system/components/ui/textarea"
import { Calendar } from "@repo/design-system/components/ui/calendar" // Import the calendar component
import { useState } from "react"

interface SettingsModalProps {
  group: {
    id: string
    name: string
    description: string
    regularPrice: number
    earlyBirdPrice: number
    earlyBirdDeadline: Date
    schedule: string
  }
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ group, isOpen, onClose }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    regularPrice: group.regularPrice,
    earlyBirdPrice: group.earlyBirdPrice,
    earlyBirdDeadline: new Date(group.earlyBirdDeadline),
    schedule: group.schedule,
  })

  const [calendarOpen, setCalendarOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${group.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          earlyBirdDeadline: formData.earlyBirdDeadline.toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Failed to update group')
      
      onClose()
      // You might want to add a refresh mechanism here
    } catch (error) {
      console.error('Error updating group:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="regularPrice">Regular Price</label>
            <Input
              id="regularPrice"
              type="number"
              value={formData.regularPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, regularPrice: parseFloat(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="earlyBirdPrice">Early Bird Price</label>
            <Input
              id="earlyBirdPrice"
              type="number"
              value={formData.earlyBirdPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, earlyBirdPrice: parseFloat(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="earlyBirdDeadline">Early Bird Deadline</label>
            <div className="relative">
              <Button
                type="button"
                onClick={() => setCalendarOpen((prev) => !prev)} // Toggle calendar visibility
              >
                {formData.earlyBirdDeadline.toLocaleDateString()} {/* Display selected date */}
              </Button>
              {calendarOpen && (
                <Calendar
                  mode="single"
                  selected={formData.earlyBirdDeadline}
                  onSelect={(date: Date | undefined) => {
                    setFormData(prev => ({
                      ...prev,
                      earlyBirdDeadline: date || prev.earlyBirdDeadline
                    }))
                    setCalendarOpen(false) // Close calendar after selection
                  }}
                  initialFocus
                />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="schedule">Schedule</label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}