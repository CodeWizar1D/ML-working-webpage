import GameCard from '../components/GameCard';
import { getFeaturedGames } from '../data/gamesData';

export default function Library() {
  const libraryGames = getFeaturedGames().slice(0, 10);

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-neon-purple text-xs font-bold uppercase tracking-[0.2em] mb-2">
            User Collection
          </p>
          <h1 className="font-display text-3xl font-black uppercase">Your Library</h1>
          <p className="text-white/40 text-sm mt-1">Saved games and active collection.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {libraryGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
