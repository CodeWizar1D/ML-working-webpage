export default function StarRating({ stars = 5, maxStars = 5, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'text-xs gap-0.5' : 'text-sm gap-1';

  return (
    <div className={`flex items-center text-neon-gold ${sizeClasses}`}>
      {[...Array(maxStars)].map((_, i) => (
        <span
          key={i}
          className={i < stars ? 'text-neon-gold drop-shadow-neon-gold' : 'text-white/20'}
        >
          ★
        </span>
      ))}
    </div>
  );
}
