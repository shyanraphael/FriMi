import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  XIcon,
  ArrowLeftIcon,
  Tv2Icon,
  ExternalLinkIcon } from
'lucide-react';
import {
  MediaDetail,
  MediaType,
  getDetail,
  IMG,
  year } from
'../lib/tmdb';
import { MediaRow } from '../components/MediaRow';

function runtimeStr(min: number | null) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function Detail() {
  const { type, id } = useParams<{type: MediaType;id: string;}>();
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  useEffect(() => {
    let live = true;
    window.scrollTo(0, 0);
    (async () => {
      if (!type || !id) return;
      try {
        setLoading(true);
        setError(false);
        const d = await getDetail(type, Number(id));
        if (live) setDetail(d);
      } catch {
        if (live) setError(true);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [type, id]);

  if (loading) {
    return (
      <div className="pt-16">
        <div className="h-[56vh] min-h-[380px] w-full animate-pulse bg-bg-2" />
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-8 w-1/3 animate-pulse rounded bg-bg-2" />
        </div>
      </div>);

  }

  if (error || !detail) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-xl font-bold">Title not found</h2>
        <Link
          to="/"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
          
          Back home
        </Link>
      </div>);

  }

  const backdrop = IMG.backdrop(detail.backdrop_path, 'original');
  const poster = IMG.poster(detail.poster_path);
  const rt = runtimeStr(detail.runtime);

  return (
    <div className="relative">
      {/* backdrop hero */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {backdrop &&
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover" />

        }
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent" />

        <Link
          to="/"
          className="absolute left-4 top-20 z-10 flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-sm font-medium sm:left-8">
          
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto -mt-56 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* poster */}
          <div className="mx-auto w-44 shrink-0 sm:w-56 md:mx-0">
            <div className="overflow-hidden rounded-3xl glass">
              {poster ?
              <img src={poster} alt={detail.title} className="w-full" /> :

              <div className="flex aspect-[2/3] items-center justify-center bg-bg-2 p-4 text-center text-sm text-text-muted">
                  {detail.title}
                </div>
              }
            </div>
          </div>

          {/* info */}
          <div className="flex-1 pt-2 md:pt-40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                {detail.title}
              </h1>
              {detail.tagline &&
              <p className="mt-2 text-base italic text-text-muted">
                  {detail.tagline}
                </p>
              }

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <span className="flex items-center gap-1.5 font-semibold text-text">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {detail.vote_average.toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  {year(detail.release_date)}
                </span>
                {rt &&
                <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    {rt}
                  </span>
                }
                {detail.number_of_seasons &&
                <span className="flex items-center gap-1.5">
                    <Tv2Icon className="h-4 w-4" />
                    {detail.number_of_seasons} season
                    {detail.number_of_seasons > 1 ? 's' : ''}
                  </span>
                }
                {detail.status &&
                <span className="rounded-full glass px-2.5 py-0.5">
                    {detail.status}
                  </span>
                }
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {detail.genres.map((g) =>
                <span
                  key={g.id}
                  className="rounded-full glass px-3 py-1 text-xs font-medium">
                  
                    {g.name}
                  </span>
                )}
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text/90 sm:text-base">
                {detail.overview || 'No synopsis available.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {detail.trailerKey &&
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
                  
                    <PlayIcon className="h-4 w-4 fill-white" /> Play trailer
                  </button>
                }

                {detail.watchProviders &&
                (detail.watchProviders.flatrate.length > 0 ||
                detail.watchProviders.rent.length > 0 ||
                detail.watchProviders.buy.length > 0) &&
                <button
                  onClick={() => setShowProviders(true)}
                  className="flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold transition hover:scale-105 active:scale-95">
                  
                    <Tv2Icon className="h-4 w-4" /> Where to watch
                  </button>
                }
              </div>
            </motion.div>
          </div>
        </div>

        {/* cast */}
        {detail.cast.length > 0 &&
        <section className="mt-14">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Top cast</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {detail.cast.map((c) =>
            <div key={c.id} className="w-28 shrink-0 text-center">
                  <div className="mx-auto mb-2 h-28 w-28 overflow-hidden rounded-2xl glass">
                    {IMG.profile(c.profile_path) ?
                <img
                  src={IMG.profile(c.profile_path)!}
                  alt={c.name}
                  className="h-full w-full object-cover" /> :


                <div className="grid h-full w-full place-items-center bg-bg-2 text-2xl font-bold text-text-muted">
                        {c.name.charAt(0)}
                      </div>
                }
                  </div>
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-text-muted">
                    {c.character}
                  </p>
                </div>
            )}
            </div>
          </section>
        }

        {/* similar */}
        {detail.similar.length > 0 &&
        <section className="mt-14">
            <MediaRow title="More like this" items={detail.similar} />
          </section>
        }
      </div>

      {/* trailer modal */}
      <AnimatePresence>
        {showTrailer && detail.trailerKey &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setShowTrailer(false)}>
          
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl glass-strong"
            onClick={(e) => e.stopPropagation()}>
            
              <button
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full glass-strong">
              
                <XIcon className="h-4 w-4" />
              </button>
              <iframe
              title="Trailer"
              src={`https://www.youtube.com/embed/${detail.trailerKey}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full" />
            
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* where-to-watch modal */}
      <AnimatePresence>
        {showProviders && detail.watchProviders &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setShowProviders(false)}>
          
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl glass-strong p-6"
            onClick={(e) => e.stopPropagation()}>
            
              <button
              onClick={() => setShowProviders(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass-strong">
              
                <XIcon className="h-4 w-4" />
              </button>

              <h3 className="mb-4 text-lg font-bold">Where to watch</h3>

              {[
              { label: 'Stream', list: detail.watchProviders.flatrate },
              { label: 'Rent', list: detail.watchProviders.rent },
              { label: 'Buy', list: detail.watchProviders.buy }].
              map(
                (group) =>
                group.list.length > 0 &&
                <div key={group.label} className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {group.list.map((p) =>
                  <div
                    key={p.provider_id}
                    title={p.provider_name}
                    className="h-12 w-12 overflow-hidden rounded-xl glass">
                    
                          {IMG.providerLogo(p.logo_path) &&
                    <img
                      src={IMG.providerLogo(p.logo_path)!}
                      alt={p.provider_name}
                      className="h-full w-full object-cover" />

                    }
                        </div>
                  )}
                    </div>
                  </div>

              )}

              {detail.watchProviders.link &&
                <a
                href={detail.watchProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
                
                  View all options <ExternalLinkIcon className="h-4 w-4" />
                </a>
              }

              <p className="mt-4 text-center text-xs text-text-muted">
                Streaming availability data provided by JustWatch.
              </p>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}