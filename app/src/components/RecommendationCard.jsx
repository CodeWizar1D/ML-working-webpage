import { Link } from 'react-router-dom';
import { FALLBACK_IMAGE } from '../data/gamesData';

const TONE_STYLES = {
  positive: 'bg-neon-green/15 text-neon-green border-neon-green/40',
  mixed: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
  negative: 'bg-red-500/15 text-red-400 border-red-500/40',
};

export default function RecommendationCard({ game, isTop = false }) {
  if (!game) return null;

  const tone = game.aiInsight?.tone || 'positive';
  const toneClass = TONE_STYLES[tone] || TONE_STYLES.positive;
  const matchPct = game.matchPercent || 85;
  const coverImg = game.cover || game.image || FALLBACK_IMAGE;
  const genreList = Array.isArray(game.genre)
    ? game.genre
    : Array.isArray(game.genres)
    ? game.genres
    : ['Action'];

  return (
    <Link
      to={`/game/${game.id}`}
      className={`glass-panel p-4 flex gap-4 group hover:-translate-y-1 transition-all duration-300 ${
        isTop
          ? 'border-2 border-neon-green/60 shadow-neon-green'
          : 'border border-white/10 hover:border-neon-cyan/40 hover:shadow-neon-cyan'
      }`}
    >
      <div className="relative shrink-0 w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
        <img
          src={coverImg}
          alt={game.title || 'Game Cover'}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base sm:text-lg group-hover:text-neon-cyan transition-colors truncate">
            {game.title || game.name || game.game_name || 'Untitled Game'}
          </h3>
          <div className="text-right shrink-0">
            <p
              className={`text-xl sm:text-2xl font-display font-black ${
                isTop ? 'text-neon-green' : 'text-neon-cyan'
              }`}
            >
              {matchPct}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Match</p>
          </div>
        </div>

        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isTop ? 'bg-neon-green shadow-neon-green' : 'bg-gradient-to-r from-neon-purple to-neon-cyan'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, matchPct))}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
            AI Insights
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${toneClass}`}
          >
            {game.aiInsight?.label || 'Positive'} ({game.aiInsight?.score || 88}%)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {genreList.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
