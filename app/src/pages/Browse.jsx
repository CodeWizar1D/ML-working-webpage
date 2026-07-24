import { useState, useMemo } from 'react';
import GameCard from '../components/GameCard';
import FilterPills from '../components/FilterPills';
import { games } from '../data/gamesData';

export default function Browse() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (selectedGenres.length > 0) {
      result = result.filter((g) =>
        g.genre.some((tag) => selectedGenres.includes(tag))
      );
    }

    if (selectedPlatform !== 'all') {
      result = result.filter((g) => g.platforms.includes(selectedPlatform));
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
      result.sort((a, b) => (b.releaseYear || '0').localeCompare(a.releaseYear || '0'));
    }

    return result;
  }, [selectedGenres, selectedPlatform, sortBy]);

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
                {['all', 'windows', 'apple', 'linux'].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setSelectedPlatform(plat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                      selectedPlatform === plat
                        ? 'bg-neon-cyan text-void font-bold'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {plat === 'apple' ? 'Mac' : plat}
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
                className="bg-surface border border-white/10 rounded-lg px-3 py-1 text-xs font-semibold text-white/80 focus:border-neon-cyan outline-none"
              >
                <option value="rating">Rating (Highest First)</option>
                <option value="name">Title (A-Z)</option>
                <option value="year">Release Year (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-white/40">
          <span>Showing <strong>{filteredGames.length}</strong> real Steam games</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {filteredGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
