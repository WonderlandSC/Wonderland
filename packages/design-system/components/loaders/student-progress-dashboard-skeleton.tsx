import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Skeleton } from "../ui/skeleton"

export function StudentProgressDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList>
          {["Individual", "Week", "Month", "Quarter", "Year"].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[490px]">
              <Skeleton className="w-full h-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32 mb-2" /></CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[460px] pr-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center mb-4">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

