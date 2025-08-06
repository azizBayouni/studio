
'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportsPageContent } from '@/components/reports-page-content';

function ReportsSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}


export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsPageContent />
    </Suspense>
  );
}
