'use client'

import { usePathname } from 'next/navigation'
import { PricingTab } from '@repo/design-system/components/pricing/pricing-tab'
import { PricingCard } from '@repo/design-system/components/pricing/pricing-card'
import { TabsContent } from "@repo/design-system/components/ui/tabs"

interface PricingPageClientProps {
  hopGroups: any[]
  growUpGroups: any[]
}

export function PricingPageClient({ hopGroups, growUpGroups }: PricingPageClientProps) {
  const pathname = usePathname()
  const isSettingsPage = pathname === '/settings'

  const renderGroupCards = (groups: any[], priceType: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {groups.map((group) => (
        <PricingCard 
          key={group.id} 
          group={group} 
          priceType={priceType} 
          showSettings={isSettingsPage}
        />
      ))}
    </div>
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PricingTab>
        <TabsContent value="regular">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">HOP</h2>
              {renderGroupCards(hopGroups, "regular")}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Grow Up</h2>
              {renderGroupCards(growUpGroups, "regular")}
            </section>
          </div>
        </TabsContent>
        
        <TabsContent value="earlyBird">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">HOP</h2>
              {renderGroupCards(hopGroups, "earlyBird")}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Grow Up</h2>
              {renderGroupCards(growUpGroups, "earlyBird")}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="threePayments">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">HOP</h2>
              {renderGroupCards(hopGroups, "threePayments")}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Grow Up</h2>
              {renderGroupCards(growUpGroups, "threePayments")}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="fourPayments">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">HOP</h2>
              {renderGroupCards(hopGroups, "fourPayments")}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Grow Up</h2>
              {renderGroupCards(growUpGroups, "fourPayments")}
            </section>
          </div>
        </TabsContent>
      </PricingTab>
    </div>
  )
}