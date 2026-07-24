import { GENRES } from '../data/gamesData';

export default function FilterPills({ selected = [], onChange }) {
  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const isSelected = selected.includes(genre);
        return (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              isSelected
                ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan shadow-neon-cyan'
                : 'bg-surface/80 text-white/50 border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
