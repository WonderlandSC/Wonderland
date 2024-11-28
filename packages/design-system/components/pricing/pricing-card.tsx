'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"
import { Settings } from "lucide-react"
import { Button } from "@repo/design-system/components/ui/button"
import { useState } from "react"
import { SettingsModal } from "../modals/settings-modal"

interface PricingCardProps {
  group: {
    id: string
    name: string
    description: string
    regularPrice: number
    earlyBirdPrice: number
    earlyBirdDeadline: Date
    schedule: string
  }
  priceType: string
  showSettings?: boolean // New prop instead of using pathname directly
}

export function PricingCard({ group, priceType, showSettings }: PricingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

const calculatePrice = () => {
  const currentDate = new Date(); // Get the current date
  const earlyBirdDeadline = new Date(group.earlyBirdDeadline); // Convert to Date object

  switch (priceType) {
    case 'earlyBird':
      const isEarlyBird = currentDate < earlyBirdDeadline; // Compare dates
      return isEarlyBird ? 
        { main: group.earlyBirdPrice, secondary: group.regularPrice } :
        { main: group.regularPrice, secondary: null };
      case 'threePayments':
        return { main: group.regularPrice / 3, secondary: group.regularPrice };
      case 'fourPayments':
        return { main: group.regularPrice / 4, secondary: group.regularPrice };
      default:
        return { main: group.regularPrice, secondary: null };
    }
  }

  const { main, secondary } = calculatePrice()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
  }

  const getPriceLabel = () => {
    if (priceType === 'threePayments') return '/ month (3 payments)';
    if (priceType === 'fourPayments') return '/ month (4 payments)';
    return '';
  }

  return (
    <>
      <Card>
        <CardHeader className="relative">
          {showSettings && ( // Use the prop instead of pathname check
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsModalOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">
                {formatPrice(main)}
                <span className="text-sm font-normal">{getPriceLabel()}</span>
              </span>
              {secondary && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(secondary)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{group.schedule}</p>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <SettingsModal 
          group={group}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}