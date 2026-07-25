import { useState, useEffect } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import FilterPills from '../components/FilterPills';
import { fetchMLRecommendations } from '../data/gamesData';
import { useUser } from '../context/UserContext';

export default function ForYou() {
  const { currentUser, updateUser } = useUser();
  const userName = currentUser ? currentUser.name : 'Gamer';
  const defaultGenres = currentUser?.favoriteGenres || ['Action', 'RPG'];

  const [selectedGenres, setSelectedGenres] = useState(defaultGenres);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync selectedGenres when active user changes
  useEffect(() => {
    if (currentUser?.favoriteGenres) {
      setSelectedGenres(currentUser.favoriteGenres);
    }
  }, [currentUser?.id, currentUser?.favoriteGenres?.join(',')]);

  // Fetch ML recommendations whenever selectedGenres changes
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
  }, [selectedGenres.join(',')]);

  const handleSaveToProfile = () => {
    if (currentUser) {
      updateUser({ favoriteGenres: selectedGenres });
    }
  };

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
  const isModifiedFromProfile =
    currentUser?.favoriteGenres &&
    JSON.stringify([...selectedGenres].sort()) !== JSON.stringify([...currentUser.favoriteGenres].sort());

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <header className="glass-panel p-6 lg:p-8 border border-neon-cyan/30 shadow-neon-cyan">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-1">
                PERSONALIZED RECOMMENDATION PIPELINE
              </p>
              <h1 className="font-display text-2xl lg:text-3xl font-black uppercase text-white">
                PERSONALIZED FOR <span className="text-neon-cyan">{userName.toUpperCase()}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-white/60">
                <span className="font-semibold text-white/40 uppercase tracking-wider">Based on interests:</span>
                {selectedGenres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan"
                  >
                    [ {g} ]
                  </span>
                ))}
              </div>
            </div>

            {isModifiedFromProfile && (
              <button
                type="button"
                onClick={handleSaveToProfile}
                className="btn-neon text-xs py-2 px-4 shrink-0"
              >
                Save Preferences to Profile
              </button>
            )}
          </div>
        </header>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-white/40 font-bold">
              Adjust Genre Preferences (Live Filter)
            </label>
            {isModifiedFromProfile && (
              <span className="text-xs text-neon-gold animate-pulse">
                Session preferences active
              </span>
            )}
          </div>
          <FilterPills selected={selectedGenres} onChange={setSelectedGenres} />
          <div className="h-0.5 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-transparent" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Showing <strong className="text-white">{recsList.length}</strong> ML matches for {userName}
            {loading && (
              <span className="ml-2 text-neon-green animate-pulse-glow">Executing Python TF-IDF Model...</span>
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
            <p className="text-neon-cyan font-display text-lg font-bold mb-2">No recommendations found</p>
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
