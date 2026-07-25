import { useState, useMemo, useEffect } from 'react';
import GameCard from '../components/GameCard';
import FilterPills from '../components/FilterPills';
import { games, loadFullDataset } from '../data/gamesData';

export default function Browse() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [visibleCount, setVisibleCount] = useState(20);
  const [catalog, setCatalog] = useState(games);

  useEffect(() => {
    loadFullDataset().then((fullList) => {
      if (Array.isArray(fullList)) {
        setCatalog(fullList);
      }
    });
  }, []);

  const filteredGames = useMemo(() => {
    let result = [...catalog];

    if (selectedGenres.length > 0) {
      result = result.filter((g) => {
        const gGenres = Array.isArray(g.genre) ? g.genre : [];
        return gGenres.some((tag) => selectedGenres.includes(tag));
      });
    }

    if (selectedPlatform === 'pc') {
      result = result.filter((g) => (g.platforms || []).includes('pc') || true);
    } else if (selectedPlatform === 'mac') {
      result = result.filter((g) => (g.platforms || []).includes('mac') || (g.platforms || []).includes('apple'));
    } else if (selectedPlatform === 'linux') {
      result = result.filter((g) => (g.platforms || []).includes('linux'));
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
      result.sort((a, b) => (b.releaseYear || '0').localeCompare(a.releaseYear || '0'));
    }

    return result;
  }, [catalog, selectedGenres, selectedPlatform, sortBy]);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Catalog Explorer
          </p>
          <h1 className="font-display text-3xl font-black uppercase">Browse All Games</h1>
        </header>

        <div className="glass-panel p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-2">
              Filter by Genre
            </label>
            <FilterPills selected={selectedGenres} onChange={setSelectedGenres} />
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-white/5">
            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-2">
                Platform
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pc', label: 'PC' },
                  { id: 'mac', label: 'Mac' },
                  { id: 'linux', label: 'Linux' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(id);
                      setVisibleCount(20);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedPlatform === id
                        ? 'bg-neon-cyan text-void font-black shadow-neon-cyan'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-white/80 focus:border-neon-cyan outline-none"
              >
                <option value="rating">Rating (Highest First)</option>
                <option value="name">Title (A-Z)</option>
                <option value="year">Release Year (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-white/40">
          <span>Showing <strong>{visibleGames.length}</strong> of <strong>{filteredGames.length}</strong> real Steam games</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {visibleGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>

        {visibleCount < filteredGames.length && (
          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 20)}
              className="btn-neon text-xs py-3 px-8 uppercase font-bold tracking-wider"
            >
              Load More Games ({filteredGames.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
