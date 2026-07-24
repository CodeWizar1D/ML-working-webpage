import { useState, useMemo } from 'react';
import GameCard from '../components/GameCard';
import { searchGames } from '../data/gamesData';

export default function Search() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchGames(query), [query]);

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Real Dataset Search
          </p>
          <h1 className="font-display text-3xl font-black uppercase">Search Games</h1>
        </header>

        <div className="glass-panel p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, developer, or tags..."
            className="w-full bg-transparent outline-none text-white text-base placeholder-white/40"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between text-sm text-white/40">
          <span>Found <strong>{results.length}</strong> matching real games</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {results.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
