


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontalIcon } from 'lucide-react';
import {
  Media,
  Genre,
  MediaType,
  discover,
  getAnime,
  getGenres } from
'../lib/tmdb';
import { MediaCard } from '../components/MediaCard';
import { GridSkeleton, CardSkeleton } from '../components/Skeletons';

type Kind = 'movie' | 'tv' | 'anime';

const SORTS: {label: string;value: string;}[] = [
{ label: 'Popular', value: 'popularity.desc' },
{ label: 'Top rated', value: 'vote_average.desc' },
{ label: 'Newest', value: 'primary_release_date.desc' }];


const TITLES: Record<Kind, string> = {
  movie: 'Movies',
  tv: 'TV Shows',
  anime: 'Anime'
};

export function Browse() {
  const { kind = 'movie' } = useParams<{kind: Kind;}>();
  const k = (['movie', 'tv', 'anime'].includes(kind) ? kind : 'movie') as Kind;
  const apiType: MediaType = k === 'anime' ? 'tv' : k;

  const [items, setItems] = useState<Media[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [sort, setSort] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // reset when kind changes
  useEffect(() => {
    setItems([]);
    setActiveGenre(null);
    setSort('popularity.desc');
    setPage(1);
    getGenres(apiType).then(setGenres).catch(() => setGenres([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  const load = useCallback(
    async (pageNum: number, replace: boolean) => {
      try {
        if (replace) setLoading(true);else
        setLoadingMore(true);
        let results: Media[];
        let total = 1;
        if (k === 'anime') {
          results = await getAnime(pageNum, sort);
          total = 500;
          if (activeGenre) {
            results = results.filter((r) => r.genre_ids?.includes(activeGenre));
          }
        } else {
          const res = await discover(apiType, {
            genre: activeGenre || undefined,
            sort,
            page: pageNum
          });
          results = res.results;
          total = res.totalPages;
        }
        setTotalPages(total);
        setItems((prev) => replace ? results : [...prev, ...results]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [k, apiType, activeGenre, sort]
  );

  useEffect(() => {
    setPage(1);
    load(1, true);
  }, [load]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, false);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 pb-8 pt-24 sm:px-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {TITLES[k]}
          </h1>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm">
            <SlidersHorizontalIcon className="h-4 w-4 text-text-muted" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-medium outline-none"
              aria-label="Sort by">
              
              {SORTS.map((s) =>
              <option key={s.value} value={s.value} className="text-black">
                  {s.label}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* genre chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveGenre(null)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeGenre === null ?
            'bg-accent text-white' :
            'glass text-text-muted hover:text-text'}`
            }>
            
            All
          </button>
          {genres.map((g) =>
          <button
            key={g.id}
            onClick={() => setActiveGenre(g.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeGenre === g.id ?
            'bg-accent text-white' :
            'glass text-text-muted hover:text-text'}`
            }>
            
              {g.name}
            </button>
          )}
        </div>
      </div>

      {loading ?
      <GridSkeleton /> :
      items.length === 0 ?
      <div className="py-24 text-center text-text-muted">
          No titles match these filters.
        </div> :

      <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((m, i) =>
          <MediaCard key={`${m.id}-${i}`} media={m} index={i % 18} />
          )}
            {loadingMore &&
          Array.from({ length: 6 }).map((_, i) =>
          <CardSkeleton key={`s-${i}`} />
          )}
          </div>

          {page < totalPages &&
        <div className="mt-10 flex justify-center">
              <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-full glass-strong px-8 py-3 text-sm font-semibold transition hover:scale-105 active:scale-95 disabled:opacity-50">
            
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
        }
        </>
      }
    </div>);

}