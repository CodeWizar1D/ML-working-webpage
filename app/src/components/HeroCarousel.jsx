import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FALLBACK_IMAGE } from '../data/gamesData';

export default function HeroCarousel({ games }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('right');

  const next = useCallback(() => {
    setDirection('right');
    setCurrent((c) => (c + 1) % (games.length || 1));
  }, [games.length]);

  useEffect(() => {
    if (!games.length) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, games.length]);

  const game = games[current];

  if (!game) return null;

  return (
    <section className="relative px-4 lg:px-8 pt-6 pb-2 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/20 shadow-neon-cyan group">
          <div
            key={game.id}
            className={`relative h-[280px] sm:h-[360px] lg:h-[420px] transition-all duration-700 ${
              direction === 'right' ? 'animate-slide-up' : 'animate-fade-in'
            }`}
          >
            <img
              src={game.image}
              alt={game.title}
              loading="eager"
              decoding="async"
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[8000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />

            <div className="relative h-full flex items-end justify-between p-6 lg:p-10">
              <div className="max-w-xl space-y-3">
                <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] animate-pulse-glow">
                  Featured Spotlight
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide">
                  {game.title}
                </h1>
                <p className="text-white/60 text-lg line-clamp-2">{game.subtitle || game.description}</p>
                <Link to={`/game/${game.id}`} className="btn-neon mt-2 inline-flex">
                  View Details
                  <ArrowIcon />
                </Link>
              </div>

              <div className="hidden sm:flex flex-col items-center gap-3 animate-float">
                <HexBadge score={game.rating} />
                <HexBadge score={game.rating} label="Editor's Choice" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {games.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setDirection(i > current ? 'right' : 'left');
                setCurrent(i);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-neon-cyan shadow-neon-cyan'
                  : 'w-4 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HexBadge({ score, label }) {
  return (
    <div className="relative w-24 h-28 flex items-center justify-center">
      <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-neon-gold">
        <polygon
          points="50,2 95,27 95,77 50,102 5,77 5,27"
          fill="rgba(10,14,23,0.85)"
          stroke="#ffd700"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
        />
      </svg>
      <div className="relative text-center z-10">
        {label ? (
          <p className="text-[8px] font-bold uppercase text-neon-gold tracking-wider leading-tight px-2">
            {label}
          </p>
        ) : (
          <>
            <p className="text-2xl font-display font-black text-neon-gold">{score}</p>
            <p className="text-[10px] text-white/50">/ 10</p>
            <div className="flex justify-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-neon-gold text-[8px]">★</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}
