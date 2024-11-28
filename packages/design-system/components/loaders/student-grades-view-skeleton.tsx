import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";

export function StudentGradesViewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
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

      {/* Grades List */}
      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

