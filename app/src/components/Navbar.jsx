import { NavLink, Link, useNavigate } from 'react-router-dom';
import { USER } from '../data/gamesData';

const NAV_ITEMS = [
  { to: '/', label: 'Discover', end: true },
  { to: '/trending', label: 'Trending' },
  { to: '/top-rated', label: 'Top Rated' },
  { to: '/browse', label: 'Browse' },
  { to: '/for-you', label: 'For You' },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="relative z-50 glass-panel border-b border-white/10 rounded-none bg-void/85">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-display font-black text-lg tracking-wider">
            <span className="text-neon-purple">GAME</span>
            <span className="text-neon-cyan">ZONE</span>
            <span className="text-white/40 text-xs ml-1 font-body font-semibold">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 border border-white/10 text-white/40 text-sm hover:border-neon-cyan/40 hover:text-white/70 transition-all w-40 lg:w-52"
          >
            <SearchIcon />
            <span>Search real games...</span>
          </button>

          <Link
            to="/search"
            className="sm:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </Link>

          <Link
            to="/notifications"
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full animate-pulse-glow" />
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-white/10 hover:border-neon-purple/50 hover:shadow-neon-purple transition-all"
          >
            <img
              src={USER.avatar}
              alt={USER.displayName}
              className="w-7 h-7 rounded-full bg-surface border border-neon-cyan/30"
            />
            <span className="hidden lg:block text-sm font-semibold text-white/80">
              {USER.displayName}
            </span>
          </Link>
        </div>
      </div>

      <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1 border-t border-white/5">
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `nav-link whitespace-nowrap text-xs ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5 text-white/60 group-hover:text-neon-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
