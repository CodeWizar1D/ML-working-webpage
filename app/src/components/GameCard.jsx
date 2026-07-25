import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import PlatformIcons from './PlatformIcons';
import { FALLBACK_IMAGE } from '../data/gamesData';

const BORDER_VARIANTS = ['neon-border-purple', 'neon-border-cyan'];

export default function GameCard({ game, index = 0, style = 'featured' }) {
  if (!game) return null;
  const borderClass = BORDER_VARIANTS[index % BORDER_VARIANTS.length];
  const coverImg = game.cover || game.image || FALLBACK_IMAGE;

  if (style === 'compact') {
    return (
      <Link
        to={`/game/${game.id}`}
        className={`glass-panel overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${borderClass}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={coverImg}
            alt={game.title || 'Game'}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-void/80 border border-white/10 text-sm font-bold text-neon-gold">
            {game.rating}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-display text-sm font-bold truncate">{game.title}</h3>
          <StarRating stars={game.stars} size="sm" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/game/${game.id}`}
      className={`glass-panel overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col ${borderClass}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={coverImg}
          alt={game.title || 'Game'}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-void/85 border border-neon-gold/30 text-neon-gold font-bold text-sm shadow-neon-gold">
          {game.rating}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display text-sm lg:text-base font-bold tracking-wide group-hover:text-neon-cyan transition-colors truncate">
          {game.title}
        </h3>
        <div className="flex items-center justify-between">
          <StarRating stars={game.stars} />
          <PlatformIcons platforms={game.platforms} />
        </div>
        <span className="mt-auto btn-neon text-center justify-center text-xs py-2 group-hover:bg-neon-cyan/15">
          More Info
        </span>
      </div>
    </Link>
  );
}
