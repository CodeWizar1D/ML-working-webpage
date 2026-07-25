import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import GameCard from '../components/GameCard';
import { getHeroGames, getFeaturedGames, loadFullDataset } from '../data/gamesData';

export default function Discover() {
  const [heroGames, setHeroGames] = useState(getHeroGames());
  const [featured, setFeatured] = useState(getFeaturedGames());

  useEffect(() => {
    loadFullDataset().then(() => {
      setHeroGames(getHeroGames());
      setFeatured(getFeaturedGames());
    });
  }, []);

  return (
    <div className="pb-12 animate-fade-in">
      <HeroCarousel games={heroGames} />

      <section className="px-4 lg:px-8 pt-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl lg:text-2xl font-bold tracking-wide">
              Featured Games
            </h2>
            <Link to="/browse" className="text-sm text-neon-cyan hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
            {featured.slice(0, 15).map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-8 pt-12">
        <div className="max-w-[1600px] mx-auto glass-panel p-6 lg:p-8 border border-neon-purple/20">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-neon-purple text-xs font-bold uppercase tracking-[0.2em] mb-2">
                ML-Powered Recommendation Engine
              </p>
              <h2 className="font-display text-2xl font-bold mb-2">
                Personalized Game Recommendations
              </h2>
              <p className="text-white/50 max-w-lg">
                Our semester ML project uses scikit-learn content-based TF-IDF and cosine similarity models on 300+ Steam games to surface titles you'll love.
              </p>
            </div>
            <Link to="/for-you" className="btn-neon-purple shrink-0">
              Explore For You
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
