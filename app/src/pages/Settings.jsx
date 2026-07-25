import { useUser } from '../context/UserContext';

export default function Settings() {
  const { resetDemoUser } = useUser();

  const handleReset = () => {
    if (window.confirm('Reset demo user profile? This will return to the onboarding screen.')) {
      resetDemoUser();
    }
  };

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in max-w-[900px] mx-auto">
      <header className="mb-6">
        <p className="text-neon-purple text-xs font-bold uppercase tracking-[0.2em] mb-2">
          Configuration
        </p>
        <h1 className="font-display text-3xl font-black uppercase">Settings</h1>
      </header>

      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-neon-cyan">ML Model Configuration</h2>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold">Python Backend Recommender API</p>
              <p className="text-white/40 text-xs">http://localhost:5000/api</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-neon-green/20 text-neon-green font-bold text-xs">ACTIVE</span>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-neon-purple">Dataset Information</h2>
          <div className="text-xs space-y-2 text-white/60">
            <p><strong>Dataset File:</strong> games.csv (400 MB real Steam catalog)</p>
            <p><strong>Processed Dataset:</strong> 300 top Steam titles in games.json</p>
            <p><strong>ML Pipeline:</strong> Content-based TF-IDF + Cosine Similarity</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-red-500/30">
          <div>
            <h3 className="font-display font-bold text-base text-red-400">College Demo Reset</h3>
            <p className="text-white/50 text-xs mt-0.5">
              Reset current demo profile to display the onboarding screen.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg font-bold text-xs bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all shrink-0"
          >
            RESET DEMO USER
          </button>
        </div>
      </div>
    </div>
  );
}
