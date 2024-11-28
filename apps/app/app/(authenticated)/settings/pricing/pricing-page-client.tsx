'use client'

import { usePathname } from 'next/navigation'
import { PricingGrid } from './pricing-grid'

interface PricingPageClientProps {
  hopGroups: any[]
  growUpGroups: any[]
}

export function PricingPageClient({ hopGroups, growUpGroups }: PricingPageClientProps) {
  const pathname = usePathname()
  const isSettingsPage = pathname === '/settings/pricing'

  return (

      <PricingGrid 
        hopGroups={hopGroups.reverse()} 
        growUpGroups={growUpGroups.reverse()} 
        showSettings={isSettingsPage}
      />
  )
}

