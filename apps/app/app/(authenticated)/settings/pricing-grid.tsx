'use client'

import { PricingCard } from '@repo/design-system/components/pricing/pricing-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs"

interface Group {
  id: string
  name: string
  description: string
  regularPrice: number
  earlyBirdPrice: number
  earlyBirdDeadline: Date
  schedule: string
}

interface PricingGridProps {
  hopGroups: Group[]
  growUpGroups: Group[]
  showSettings: boolean
}

export function PricingGrid({ hopGroups, growUpGroups, showSettings }: PricingGridProps) {
  const renderGroupCards = (groups: Group[], priceType: string, isEarlyBirdTab: boolean, groupType: 'primary' | 'secondary') => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {groups.map((group) => (
        <PricingCard
          key={group.id}
          group={group}
          priceType={priceType}
          showSettings={showSettings}
          isEarlyBirdTab={isEarlyBirdTab}
          groupType={groupType}
        />
      ))}
    </div>
  )

  return (
    <Tabs defaultValue="regular" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="regular">Regular</TabsTrigger>
        <TabsTrigger value="earlyBird">Early Bird</TabsTrigger>
        <TabsTrigger value="threePayments">3 Payments</TabsTrigger>
        <TabsTrigger value="fourPayments">4 Payments</TabsTrigger>
      </TabsList>
      {['regular', 'earlyBird', 'threePayments', 'fourPayments'].map((priceType) => (
        <TabsContent key={priceType} value={priceType}>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">HOP</h2>
              {renderGroupCards(hopGroups, priceType, priceType === 'earlyBird', 'primary')}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Grow Up</h2>
              {renderGroupCards(growUpGroups, priceType, priceType === 'earlyBird', 'secondary')}
            </section>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

