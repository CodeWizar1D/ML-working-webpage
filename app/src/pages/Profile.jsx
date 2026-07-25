import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import FilterPills from '../components/FilterPills';
import GameCard from '../components/GameCard';
import { getFeaturedGames } from '../data/gamesData';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, demoProfiles, updateUser, switchUser, resetDemoUser, allGenres } = useUser();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editGenres, setEditGenres] = useState(currentUser?.favoriteGenres || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditGenres(currentUser.favoriteGenres || []);
    }
  }, [currentUser?.id]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateUser({
      name: editName.trim(),
      favoriteGenres: editGenres,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset demo user profile? This will return to the onboarding screen.')) {
      resetDemoUser();
    }
  };

  const savedGames = getFeaturedGames().slice(0, 5);

  if (!currentUser) {
    return (
      <div className="px-4 lg:px-8 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">No Active Profile</h1>
        <p className="text-white/50 mb-6">Create or select a profile to demonstrate personalized ML recommendations.</p>
        <button type="button" onClick={resetDemoUser} className="btn-neon">
          Open Onboarding Screen
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in">
      <div className="max-w-[1200px] mx-auto space-y-8">

        {/* Current Active Profile Header */}
        <div className="glass-panel p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 border-2 border-neon-cyan/40 shadow-neon-cyan">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full bg-surface border-2 border-neon-cyan shadow-neon-cyan shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="font-display text-2xl lg:text-3xl font-black">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/40">
                @{currentUser.username}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neon-green/20 text-neon-green border border-neon-green/40">
                ACTIVE DEMO USER
              </span>
            </div>
            <p className="text-white/50 text-sm">
              College ML Recommendation Project Demo User
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs text-white/40 uppercase tracking-wider font-bold mr-1">Favorite Genres:</span>
              {currentUser.favoriteGenres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 text-white/80 border border-white/10">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/for-you')}
            className="btn-neon shrink-0 text-xs py-2.5 px-4"
          >
            View Live Recommendations →
          </button>
        </div>

        {/* EDIT PREFERENCES FORM */}
        <section className="glass-panel p-6 lg:p-8 space-y-6 border border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-neon-cyan">Edit Profile & Preferences</h2>
            {saveSuccess && (
              <span className="text-xs font-bold text-neon-green animate-pulse">
                ✓ Preferences Saved! Check /for-you page.
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-white/50">
                User Display Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name..."
                className="w-full max-w-md bg-surface border border-white/10 focus:border-neon-cyan rounded-xl px-4 py-2.5 text-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-white/50">
                Favorite Genres (Select multiple)
              </label>
              <FilterPills selected={editGenres} onChange={setEditGenres} />
            </div>

            <button type="submit" className="btn-neon text-xs py-2.5 px-6">
              SAVE PREFERENCES
            </button>
          </form>
        </section>

        {/* DEMO USER SWITCHER FOR LIVE PRESENTATION */}
        <section className="glass-panel p-6 lg:p-8 space-y-4 border border-neon-purple/30">
          <h2 className="font-display text-xl font-bold text-neon-purple">College Demo User Switcher</h2>
          <p className="text-white/50 text-sm">
            Quickly switch profiles during your live presentation to demonstrate how recommendations dynamically change for different users.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {demoProfiles.map((p) => {
              const isActive = currentUser.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`glass-panel p-4 flex flex-col justify-between gap-3 transition-all ${
                    isActive
                      ? 'border-2 border-neon-cyan shadow-neon-cyan bg-neon-cyan/5'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-base text-white">{p.name}</h3>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold text-neon-cyan bg-neon-cyan/20 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2">
                      {p.favoriteGenres.join(' · ')}
                    </p>
                  </div>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => switchUser(p.id)}
                      className="btn-neon-purple text-xs py-1.5 text-center justify-center w-full"
                    >
                      Switch to {p.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RESET DEMO USER BUTTON */}
        <section className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-red-500/30">
          <div>
            <h3 className="font-display font-bold text-base text-red-400">Reset Demo User</h3>
            <p className="text-white/50 text-xs mt-0.5">
              Clears the current profile and re-opens the first-time onboarding screen for a new presentation run.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg font-bold text-xs bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all shrink-0"
          >
            RESET DEMO USER
          </button>
        </section>

        {/* Saved Library Games */}
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
