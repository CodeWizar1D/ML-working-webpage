import { useState, useEffect } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import FilterPills from '../components/FilterPills';
import { fetchMLRecommendations, USER } from '../data/gamesData';

export default function ForYou() {
  const [selectedGenres, setSelectedGenres] = useState(USER.favoriteGenres || ['Action', 'RPG']);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchMLRecommendations(selectedGenres)
      .then((data) => {
        if (isMounted) {
          setRecommendations(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching ML recommendations:', err);
        if (isMounted) {
          setRecommendations([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedGenres]);

  const handleResync = async () => {
    setLoading(true);
    try {
      const data = await fetchMLRecommendations(selectedGenres);
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error resyncing recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const recsList = Array.isArray(recommendations) ? recommendations : [];

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-6">
          <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-2">
            ML Recommendation Engine
          </p>
          <h1 className="font-display text-2xl lg:text-3xl font-black uppercase">
            AI Game Recommendations
          </h1>
          <p className="text-white/40 text-sm mt-1">For {USER.username}</p>
        </header>

        <div className="mb-6 space-y-3">
          <FilterPills selected={selectedGenres} onChange={setSelectedGenres} />
          <div className="h-0.5 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-transparent" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/40">
            {recsList.length} personalized matches
            {loading && (
              <span className="ml-2 text-neon-green animate-pulse-glow">Executing Python ML Recommender...</span>
            )}
          </p>
          <button type="button" onClick={handleResync} className="btn-neon text-xs py-2">
            Re-run Python ML Model
          </button>
        </div>

        {loading && recsList.length === 0 && (
          <div className="glass-panel p-12 text-center my-8">
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/60 text-sm">Calculating TF-IDF Cosine Similarity for selected genres...</p>
          </div>
        )}

        {!loading && recsList.length === 0 && (
          <div className="glass-panel p-12 text-center my-8 border border-neon-purple/30">
            <p className="text-neon-cyan font-display text-lg font-bold mb-2">No recommendations yet</p>
            <p className="text-white/50 text-sm">Select some genre pills above to discover games tailored to your preferences.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recsList.map((game, i) => (
            <RecommendationCard key={game?.id || i} game={game} isTop={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
