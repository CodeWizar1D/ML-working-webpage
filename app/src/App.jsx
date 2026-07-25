import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import OnboardingModal from './components/OnboardingModal';
import Layout from './components/Layout';
import Discover from './pages/Discover'; // Eagerly loaded for fast initial LCP

// Lazy-loaded secondary pages for route-level code splitting & fast initial page load
const Trending = lazy(() => import('./pages/Trending'));
const TopRated = lazy(() => import('./pages/TopRated'));
const Browse = lazy(() => import('./pages/Browse'));
const ForYou = lazy(() => import('./pages/ForYou'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Search = lazy(() => import('./pages/Search'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Library = lazy(() => import('./pages/Library'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs uppercase font-bold tracking-widest text-white/40">Loading GAMEZONE...</p>
    </div>
  );
}

export default function App() {
  const { isOnboarded } = useUser();

  return (
    <>
      {!isOnboarded && <OnboardingModal />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Discover />} />
            <Route path="trending" element={<Trending />} />
            <Route path="top-rated" element={<TopRated />} />
            <Route path="browse" element={<Browse />} />
            <Route path="for-you" element={<ForYou />} />
            <Route path="game/:id" element={<GameDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="library" element={<Library />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
