

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import {
  Media,
  getTrending,
  getList,
  getAnime } from
'../lib/tmdb';
import { HeroCarousel } from '../components/HeroCarousel';
import { MediaRow } from '../components/MediaRow';

interface RowState {
  trending: Media[];
  popularMovies: Media[];
  topMovies: Media[];
  popularTv: Media[];
  topTv: Media[];
  anime: Media[];
  nowPlaying: Media[];
}

const empty: RowState = {
  trending: [],
  popularMovies: [],
  topMovies: [],
  popularTv: [],
  topTv: [],
  anime: [],
  nowPlaying: []
};

function MoreLink({ to }: {to: string;}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-accent transition hover:gap-2">
      
      See all <ArrowRightIcon className="h-3.5 w-3.5" />
    </Link>);

}

export function Home() {
  const [data, setData] = useState<RowState>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const [
        trending,
        popularMovies,
        topMovies,
        nowPlaying,
        popularTv,
        topTv,
        anime] =
        await Promise.all([
        getTrending('week'),
        getList('movie', 'popular'),
        getList('movie', 'top_rated'),
        getList('movie', 'now_playing'),
        getList('tv', 'popular'),
        getList('tv', 'top_rated'),
        getAnime()]
        );
        if (!live) return;
        setData({
          trending,
          popularMovies,
          topMovies,
          nowPlaying,
          popularTv,
          topTv,
          anime
        });
      } catch {
        if (live) setError(true);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-2 text-xl font-bold">Couldn't reach the catalog</h2>
        <p className="mb-4 text-sm text-text-muted">
          The movie server is temporarily unavailable. If this keeps happening,
          the TMDB API key in <code>lib/tmdb.ts</code> may be rate limited — swap
          in your own free key.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
          
          Retry
        </button>
      </div>);

  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-3 pb-8 pt-24 sm:px-6">
      <HeroCarousel items={data.trending} loading={loading} />

      <MediaRow
        title= "Trending this week"
        items={data.trending}
        loading={loading} />
      
      <MediaRow
        title="Popular movies"
        items={data.popularMovies}
        loading={loading}
        action={<MoreLink to="/browse/movie" />} />
      
      <MediaRow
        title="Popular TV shows"
        items={data.popularTv}
        loading={loading}
        action={<MoreLink to="/browse/tv" />} />
      
      <MediaRow
        title="Anime spotlight"
        items={data.anime}
        loading={loading}
        action={<MoreLink to="/browse/anime" />} />
      
      <MediaRow
        title="Now playing in theaters"
        items={data.nowPlaying}
        loading={loading} />
      
      <MediaRow
        title="Top rated movies"
        items={data.topMovies}
        loading={loading} />
      
      <MediaRow title="Top rated TV" items={data.topTv} loading={loading} />
    </div>);

}