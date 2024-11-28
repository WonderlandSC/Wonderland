'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"
import { Settings } from 'lucide-react'
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
  showSettings: boolean
  isEarlyBirdTab: boolean
  groupType: 'primary' | 'secondary'
}

export function PricingCard({ group, priceType, showSettings, isEarlyBirdTab, groupType }: PricingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentDate = new Date();
  const earlyBirdDeadline = new Date(group.earlyBirdDeadline);
  const isEarlyBirdActive = currentDate < earlyBirdDeadline;

  const calculatePrice = () => {
    switch (priceType) {
      case 'earlyBird':
        return { main: group.earlyBirdPrice, secondary: group.regularPrice };
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
    const roundedPrice = Math.ceil(price);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BGN', minimumFractionDigits: 0 }).format(roundedPrice);
  }

  const getPriceLabel = () => {
    if (priceType === 'threePayments') return '/ month';
    if (priceType === 'fourPayments') return '/ month';
    return '';
  }

  const isButtonDisabled = isEarlyBirdTab && !isEarlyBirdActive;

  const cardBorderColor = groupType === 'primary' ? 'border-purple-200' : 'border-cyan-200';
  const buttonColors = groupType === 'primary'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-cyan-600 hover:bg-cyan-700 text-white';

  return (
    <>
      <Card className={`border-2 ${cardBorderColor} transition-all duration-300 ease-in-out hover:shadow-md`}>
        <CardHeader className="relative">
          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsModalOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-xl font-semibold">{group.name}</CardTitle>
          <CardDescription className="text-sm">{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">
                {formatPrice(main)}
                <span className="text-sm font-normal">{getPriceLabel()}</span>
              </span>
              {secondary && (
                <span className={`text-sm text-muted-foreground ${priceType === 'earlyBird' ? 'line-through' : ''}`}>
                  {formatPrice(secondary)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{group.schedule}</p>
            <div className="pt-4">
              <Button 
                className={`w-full ${buttonColors}`}
                variant={isButtonDisabled ? "outline" : "default"} 
                disabled={isButtonDisabled}
              >
                Contact Us
              </Button>
            </div>
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

