import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function OnboardingModal() {
  const { createUser, switchUser, demoProfiles, allGenres } = useUser();
  const [name, setName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(['Action', 'RPG']);
  const [error, setError] = useState('');

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to personalize your recommendations.');
      return;
    }
    if (selectedGenres.length === 0) {
      setError('Please select at least one favorite genre.');
      return;
    }
    setError('');
    createUser(name, selectedGenres);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-2xl border-2 border-neon-cyan/40 shadow-neon-cyan relative my-8">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-bold uppercase tracking-wider mb-1">
            <span>🎓 College Project Live Demo</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            WELCOME TO <span className="text-neon-purple">GAME</span><span className="text-neon-cyan">ZONE</span><span className="text-white/40 text-xs ml-1 font-body">AI</span>
          </h2>
          <p className="text-white/60 text-sm">
            Set up your personalized gaming profile to demonstrate live ML recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-neon-cyan">
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Jai, Teacher Demo, Harish..."
              className="w-full bg-surface border border-white/10 focus:border-neon-cyan rounded-xl px-4 py-3 text-white placeholder-white/30 text-base outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-bold text-neon-cyan">
              Choose your favorite genres ({selectedGenres.length} selected)
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-white/5 rounded-xl bg-surface/40">
              {allGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase transition-all duration-200 ${
                      isSelected
                        ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-neon-cyan'
                        : 'bg-surface text-white/50 border border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{genre}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-neon-pink text-xs font-bold text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full btn-neon py-3.5 text-center justify-center text-sm font-black tracking-wider uppercase shadow-neon-cyan hover:scale-[1.02] transition-all"
          >
            START DISCOVERING →
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-xs uppercase tracking-wider text-white/40 font-bold mb-3">
            ⚡ Quick Demo Presets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => switchUser(p.id)}
                className="glass-panel p-2.5 text-left hover:border-neon-cyan/60 hover:shadow-neon-cyan transition-all group border border-white/10"
              >
                <p className="font-display font-bold text-xs group-hover:text-neon-cyan truncate">
                  {p.name}
                </p>
                <p className="text-[10px] text-white/40 truncate mt-0.5">
                  {p.favoriteGenres.join(', ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
