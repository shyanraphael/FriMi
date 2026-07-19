

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, StarIcon, InfoIcon } from 'lucide-react';
import { Media, IMG, year } from '../lib/tmdb';
import { HeroSkeleton } from './Skeletons';

interface Props {
  items: Media[];
  loading?: boolean;
}

export function HeroCarousel({ items, loading }: Props) {
  const [i, setI] = useState(0);
  const slides = items.slice(0, 6);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading || slides.length === 0) return <HeroSkeleton />;

  const active = slides[i];
  const backdrop = IMG.backdrop(active.backdrop_path, 'original');

  return (
    <div className="relative h-[64vh] min-h-[460px] w-full overflow-hidden rounded-4xl glass">
      <AnimatePresence mode="wait">
        <motion.img
          key={active.id}
          src={backdrop || IMG.poster(active.poster_path, 'w500') || ''}
          alt={active.title}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full w-full object-cover" />
        
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-10 md:max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}>
            
            <div className="mb-3 flex items-center gap-2 text-sm text-white/85">
              <span className="rounded-full glass-strong bg-white/15 px-2.5 py-0.5 uppercase tracking-wide backdrop-blur">
                {active.media_type === 'tv' ? 'TV' : 'Movie'}
              </span>
              <span className="flex items-center gap-1">
                <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {active.vote_average.toFixed(1)}
              </span>
              <span>{year(active.release_date)}</span>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {active.title}
            </h1>
            <p className="mb-6 line-clamp-3 max-w-xl text-sm text-white/80 sm:text-base">
              {active.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/title/${active.media_type}/${active.id}`}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 active:scale-95">
                
                <PlayIcon className="h-4 w-4 fill-black" /> Watch trailer
              </Link>
              <Link
                to={`/title/${active.media_type}/${active.id}`}
                className="flex items-center gap-2 rounded-full glass-strong px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
                
                <InfoIcon className="h-4 w-4" /> More info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-2">
          {slides.map((_, idx) =>
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
            idx === i ? 'w-8 bg-white' : 'w-3 bg-white/40'}`
            } />

          )}
        </div>
      </div>
    </div>);

}