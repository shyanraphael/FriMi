
import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Media } from '../lib/tmdb';
import { MediaCard } from './MediaCard';
import { CardSkeleton } from './Skeletons';

interface Props {
  title: string;
  items: Media[];
  loading?: boolean;
  action?: React.ReactNode;
}

export function MediaRow({ title, items, loading, action }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({
      left: dir * (scroller.current.clientWidth * 0.8),
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <div className="hidden gap-1.5 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="grid h-9 w-9 place-items-center rounded-full glass transition hover:scale-105 active:scale-95">
              
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="grid h-9 w-9 place-items-center rounded-full glass transition hover:scale-105 active:scale-95">
              
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2">
        
        {loading ?
        Array.from({ length: 8 }).map((_, i) =>
        <div key={i} className="w-[150px] shrink-0 sm:w-[180px]">
                <CardSkeleton />
              </div>
        ) :
        items.map((m, i) =>
        <div
          key={`${m.media_type}-${m.id}`}
          className="w-[150px] shrink-0 sm:w-[180px]">
          
                <MediaCard media={m} index={i} />
              </div>
        )}
      </div>
    </section>);

}