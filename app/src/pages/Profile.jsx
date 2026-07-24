import { USER, getFeaturedGames } from '../data/gamesData';
import GameCard from '../components/GameCard';

export default function Profile() {
  const savedGames = getFeaturedGames().slice(0, 5);

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="glass-panel p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={USER.avatar}
            alt={USER.displayName}
            className="w-24 h-24 rounded-full bg-surface border-2 border-neon-cyan shadow-neon-cyan shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="font-display text-2xl lg:text-3xl font-black">{USER.displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/40">
                @{USER.username}
              </span>
            </div>
            <p className="text-white/50 text-sm">
              ML Student & Gaming Enthusiast · Semester Recommendation Project
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs">
              <div>
                <span className="text-white/40">Played: </span>
                <strong className="text-neon-cyan">{USER.gamesPlayed} games</strong>
              </div>
              <div>
                <span className="text-white/40">Hours: </span>
                <strong className="text-neon-cyan">{USER.hoursPlayed} hrs</strong>
              </div>
              <div>
                <span className="text-white/40">ML Match Score: </span>
                <strong className="text-neon-green">{USER.mlProfileScore}%</strong>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="font-display text-xl font-bold mb-4">Saved Library Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {savedGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} style="compact" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
