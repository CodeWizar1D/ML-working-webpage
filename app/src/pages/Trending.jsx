import GameCard from '../components/GameCard';
import { getTrendingGames } from '../data/gamesData';

export default function Trending() {
  const games = getTrendingGames();

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Steam Active Players & Popularity
          </p>
          <h1 className="font-display text-3xl font-black uppercase">Trending Now</h1>
          <p className="text-white/40 text-sm mt-1">Real games sorted by peak player count and community activity.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
