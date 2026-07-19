
import React from 'react';

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] w-full rounded-2xl bg-bg-2" />
      <div className="mt-2 h-3 w-3/4 rounded bg-bg-2" />
      <div className="mt-1.5 h-2.5 w-1/3 rounded bg-bg-2" />
    </div>);

}

export function HeroSkeleton() {
  return (
    <div className="relative h-[62vh] min-h-[440px] w-full animate-pulse overflow-hidden rounded-4xl bg-bg-2" />);

}

export function GridSkeleton({ count = 18 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) =>
      <CardSkeleton key={i} />
      )}
    </div>);

}