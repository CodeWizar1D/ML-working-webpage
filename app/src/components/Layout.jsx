import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SIDEBAR_ROUTES = ['/for-you', '/profile', '/library', '/settings'];

export default function Layout() {
  const { pathname } = useLocation();
  const showSidebar = SIDEBAR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <div className="min-h-screen cyber-grid">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] ${
            showSidebar ? 'ml-16 lg:ml-20' : ''
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
