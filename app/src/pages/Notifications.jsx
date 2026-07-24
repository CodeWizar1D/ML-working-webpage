export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Python ML Recommender Sync Complete', desc: 'Content-based TF-IDF similarity updated for your favorite genres.', time: '10m ago', unread: true },
    { id: 2, title: 'New Trending Game Added', desc: 'Counter-Strike 2 updated with latest active player counts.', time: '1h ago', unread: true },
    { id: 3, title: 'Model Pipeline Check', desc: 'Dataset contains 300 real Steam games ready for collaborative filtering.', time: '1d ago', unread: false },
  ];

  return (
    <div className="px-4 lg:px-8 py-8 animate-fade-in max-w-[900px] mx-auto">
      <header className="mb-6">
        <p className="text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-2">
          System Updates
        </p>
        <h1 className="font-display text-3xl font-black uppercase">Notifications</h1>
      </header>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`glass-panel p-4 flex items-start justify-between gap-4 border ${n.unread ? 'border-neon-cyan/40 bg-surface/90' : 'border-white/5'}`}>
            <div>
              <h3 className="font-display font-bold text-sm text-white">{n.title}</h3>
              <p className="text-white/60 text-xs mt-1">{n.desc}</p>
            </div>
            <span className="text-[10px] text-white/40 shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
