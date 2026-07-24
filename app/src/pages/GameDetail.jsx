import { Link, useParams, useNavigate } from 'react-router-dom';
import { getGameById, games, FALLBACK_IMAGE } from '../data/gamesData';
import StarRating from '../components/StarRating';
import PlatformIcons from '../components/PlatformIcons';
import GameCard from '../components/GameCard';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = getGameById(id);

  if (!game) {
    return (
      <div className="px-4 lg:px-8 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Game Not Found</h1>
        <Link to="/browse" className="btn-neon">
          Browse Games
        </Link>
      </div>
    );
  }

  const similar = games
    .filter((g) => String(g.id) !== String(game.id) && g.genre.some((t) => game.genre.includes(t)))
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div className="relative h-[240px] sm:h-[320px] lg:h-[400px] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 glass-panel px-3 py-1.5 text-sm hover:border-neon-cyan/50 transition-all flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      <div className="px-4 lg:px-8 -mt-20 relative z-10 pb-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <img
              src={game.cover}
              alt={game.title}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              className="w-48 lg:w-56 rounded-xl border-2 border-neon-cyan/30 shadow-neon-cyan shrink-0 aspect-[4/5] object-cover"
            />

            <div className="flex-1 space-y-4">
              <div>
                {game.editorsChoice && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neon-gold/10 text-neon-gold border border-neon-gold/30 mb-2">
                    Editor's Choice
                  </span>
                )}
                <h1 className="font-display text-3xl lg:text-4xl font-black">{game.title}</h1>
                <p className="text-white/50">{game.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-display font-black text-neon-gold">
                    {game.rating}
                  </span>
                  <span className="text-white/40 text-sm">/ 10</span>
                </div>
                <StarRating stars={game.stars} />
                <PlatformIcons platforms={game.platforms} />
              </div>

              {game.matchPercent && (
                <div className="glass-panel p-4 border border-neon-green/30 max-w-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase tracking-wider text-white/40 font-bold">
                      ML Match Score
                    </span>
                    <span className="text-2xl font-display font-black text-neon-green">
                      {game.matchPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-neon-green shadow-neon-green"
                      style={{ width: `${game.matchPercent}%` }}
                    />
                  </div>
                  {game.aiInsight && (
                    <p className="text-xs text-white/50 mt-2">
                      AI Sentiment: <strong className="text-neon-cyan">{game.aiInsight.label} ({game.aiInsight.score}%)</strong>
                    </p>
                  )}
                </div>
              )}

              <p className="text-white/70 leading-relaxed max-w-2xl">{game.description}</p>

              <div className="flex flex-wrap gap-2">
                {game.genre.map((tag) => (
                  <Link
                    key={tag}
                    to="/browse"
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:border-neon-cyan/50 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/for-you" className="btn-neon">
                  Add to Recommendations
                </Link>
                <Link to="/library" className="btn-neon-purple">
                  Save to Library
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-xs text-white/40 pt-2 border-t border-white/5">
                <span>Developer: <strong className="text-white/70">{game.developer}</strong></span>
                <span>Release: <strong className="text-white/70">{game.releaseYear}</strong></span>
                <span>Positive Reviews: <strong className="text-neon-green">{game.positive.toLocaleString()}</strong></span>
                <span>Peak Players: <strong className="text-neon-cyan">{game.peak_ccu.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold mb-4">Similar Games</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {similar.map((g, i) => (
                  <GameCard key={g.id} game={g} index={i} style="compact" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
