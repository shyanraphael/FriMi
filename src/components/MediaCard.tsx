
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, PlayIcon } from 'lucide-react';
import { Media, IMG, year } from '../lib/tmdb';

interface Props {
  media: Media;
  index?: number;
}

export function MediaCard({ media, index = 0 }: Props) {
  const poster = IMG.poster(media.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}>
      
      <Link
        to={`/title/${media.media_type}/${media.id}`}
        className="group block"
        aria-label={media.title}>
        
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl glass">
          {poster ?
          <img
            src={poster}
            alt={media.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" /> :


          <div className="flex h-full w-full items-center justify-center bg-bg-2 px-3 text-center text-xs text-text-muted">
              {media.title}
            </div>
          }

          {/* rating pill */}
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full glass-strong px-2 py-0.5 text-[11px] font-semibold">
            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {media.vote_average.toFixed(1)}
          </div>

          {/* hover overlay */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="w-full p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/90">
                <span className="rounded-md bg-white/15 px-1.5 py-0.5 uppercase tracking-wide backdrop-blur">
                  {media.media_type}
                </span>
                <span>{year(media.release_date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <PlayIcon className="h-4 w-4 fill-white" /> View details
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 truncate px-0.5 text-sm font-medium text-text">
          {media.title}
        </p>
        <p className="px-0.5 text-xs text-text-muted">
          {year(media.release_date)}
        </p>
      </Link>
    </motion.div>);

}