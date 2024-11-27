import { database } from "@repo/database"
import { PricingPageClient } from './pricing-page-client'

async function getGroups() {
  return await database.group.findMany({
    orderBy: { name: 'asc' }
  })
}

export default async function PricingPage() {
  const groups = await getGroups()
  const hopGroups = groups.filter((g: any) => g.name.toLowerCase().startsWith('hop'))
  const growUpGroups = groups.filter((g: any) => g.name.toLowerCase().includes('grow up'))

  return (
    <PricingPageClient 
      hopGroups={hopGroups} 
      growUpGroups={growUpGroups} 
    />
  )
}