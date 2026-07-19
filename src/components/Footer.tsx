
import React from 'react';
import { FilmIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 px-3 pb-8 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-4xl glass p-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-white">
            <FilmIcon className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">FriMi</span>
        </div>
        <p className="mx-auto max-w-md text-sm text-text-muted">
          Your universe of movies, TV shows and anime — all in one glassy place.
        </p>
        <p className="mt-4 text-xs text-text-muted">
          Data provided by TMDB. This product uses the TMDB API but is not
          endorsed or certified by TMDB.
        </p>
      </div>
    </footer>);

}