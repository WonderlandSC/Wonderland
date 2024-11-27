import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs"

export function PricingTab({ children }: { children: React.ReactNode }) {
  return (
    <Tabs defaultValue="regular">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="regular">Regular</TabsTrigger>
        <TabsTrigger value="earlyBird">Early Bird</TabsTrigger>
        <TabsTrigger value="threePayments">3 Payments</TabsTrigger>
        <TabsTrigger value="fourPayments">4 Payments</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}