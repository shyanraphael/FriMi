
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
  FilmIcon,
  MenuIcon,
  XIcon } from
'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [
{ to: '/', label: 'Home' },
{ to: '/browse/movie', label: 'Movies' },
{ to: '/browse/tv', label: 'TV Shows' },
{ to: '/browse/anime', label: 'Anime' }];


export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300 ${
        scrolled ? 'glass-strong' : 'glass'}`
        }>
        
        <Link to="/" className="flex items-center gap-2 pr-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-white">
            <FilmIcon className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">FriMi</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) =>
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
            `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            isActive ?
            'bg-accent/15 text-accent' :
            'text-text-muted hover:text-text'}`

            }>
            
              {l.label}
            </NavLink>
          )}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden flex-1 max-w-xs sm:block">
          <div className="flex items-center gap-2 rounded-full bg-bg-2/60 px-3 py-1.5">
            <SearchIcon className="h-4 w-4 text-text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, shows, anime…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" />
            
          </div>
        </form>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full glass transition hover:scale-105 active:scale-95">
          
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              
              {theme === 'dark' ?
              <SunIcon className="h-4 w-4" /> :

              <MoonIcon className="h-4 w-4" />
              }
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full glass md:hidden">
          
          {mobileOpen ?
          <XIcon className="h-4 w-4" /> :

          <MenuIcon className="h-4 w-4" />
          }
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl glass-strong p-3 md:hidden">
          
            <form onSubmit={submit} className="mb-2 sm:hidden">
              <div className="flex items-center gap-2 rounded-full bg-bg-2/60 px-3 py-2">
                <SearchIcon className="h-4 w-4 text-text-muted" />
                <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" />
              
              </div>
            </form>
            <div className="grid gap-1">
              {links.map((l) =>
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-medium transition ${
              isActive ?
              'bg-accent/15 text-accent' :
              'text-text-muted hover:text-text'}`

              }>
              
                  {l.label}
                </NavLink>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}