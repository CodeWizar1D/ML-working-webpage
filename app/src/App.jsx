import { Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import OnboardingModal from './components/OnboardingModal';
import Layout from './components/Layout';
import Discover from './pages/Discover';
import Trending from './pages/Trending';
import TopRated from './pages/TopRated';
import Browse from './pages/Browse';
import ForYou from './pages/ForYou';
import GameDetail from './pages/GameDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Library from './pages/Library';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  const { isOnboarded } = useUser();

  return (
    <>
      {!isOnboarded && <OnboardingModal />}
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
    </>
  );
}
