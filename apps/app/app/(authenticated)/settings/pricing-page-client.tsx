'use client'

import { usePathname } from 'next/navigation'
import { PricingGrid } from './pricing-grid'

interface PricingPageClientProps {
  hopGroups: any[]
  growUpGroups: any[]
}

export function PricingPageClient({ hopGroups, growUpGroups }: PricingPageClientProps) {
  const pathname = usePathname()
  const isSettingsPage = pathname === '/settings'

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Pricing Plans</h1>
      <PricingGrid 
        hopGroups={hopGroups} 
        growUpGroups={growUpGroups} 
        showSettings={isSettingsPage}
      />
    </div>
  )
}

