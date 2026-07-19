


import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { Media, searchMulti } from '../lib/tmdb';
import { MediaCard } from '../components/MediaCard';
import { GridSkeleton } from '../components/Skeletons';

export function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let live = true;
    if (!q) {
      setResults([]);
      return;
    }
    ;(async () => {
      setLoading(true);
      try {
        const r = await searchMulti(q);
        if (live) setResults(r);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-3 pb-8 pt-24 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <SearchIcon className="h-6 w-6 text-text-muted" />
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Results for “{q}”
        </h1>
      </div>

      {loading ?
      <GridSkeleton /> :
      results.length === 0 ?
      <div className="py-24 text-center text-text-muted">
          {q ? 'Nothing found. Try another title.' : 'Type something to search.'}
        </div> :

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((m, i) =>
        <MediaCard key={`${m.media_type}-${m.id}`} media={m} index={i % 18} />
        )}
        </div>
      }
    </div>);

}