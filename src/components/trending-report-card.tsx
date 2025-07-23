
'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TrendingReportCard() {
  return (
    <Card className="flex items-center justify-center">
      <CardContent className="p-4">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <p className="text-lg font-semibold text-accent">Trending report</p>
                       <div className="text-xs text-muted-foreground">Page {index + 1} of 3</div>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
            <div className="flex items-center justify-center gap-8 mt-2">
                <CarouselPrevious className="static translate-y-0" />
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-2 h-2 rounded-full bg-muted" />
                    <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
                <CarouselNext className="static translate-y-0" />
            </div>
        </Carousel>
      </CardContent>
    </Card>
  );
}
