import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-4 lg:px-8 py-20 text-center animate-fade-in">
      <h1 className="font-display text-4xl lg:text-6xl font-black text-neon-purple mb-4">404</h1>
      <p className="text-white/60 text-lg mb-8">Page Not Found in GAMEZONE AI</p>
      <Link to="/" className="btn-neon">
        Return to Discover
      </Link>
    </div>
  );
}
