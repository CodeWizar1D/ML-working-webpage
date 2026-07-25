import { createContext, useContext, useState, useEffect } from 'react';
import { GENRES } from '../data/gamesData';

const UserContext = createContext();

const STORAGE_KEY_ACTIVE = 'gamezone_active_user';
const STORAGE_KEY_PROFILES = 'gamezone_demo_profiles';

const DEFAULT_DEMO_PROFILES = [
  {
    id: 'demo-jai',
    name: 'Jai',
    username: 'jai_ml',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaiHarish',
    favoriteGenres: ['Horror', 'Action', 'RPG'],
  },
  {
    id: 'demo-teacher',
    name: 'Teacher Demo',
    username: 'prof_evaluator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfessorDemo',
    favoriteGenres: ['Racing', 'Sports'],
  },
  {
    id: 'demo-player3',
    name: 'Player 3',
    username: 'gamer_strat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrategyMaster',
    favoriteGenres: ['Strategy', 'Simulation'],
  },
];

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [demoProfiles, setDemoProfiles] = useState(DEFAULT_DEMO_PROFILES);
  const [isOnboarded, setIsOnboarded] = useState(true); // Default true until checked in useEffect

  useEffect(() => {
    try {
      const savedProfilesRaw = localStorage.getItem(STORAGE_KEY_PROFILES);
      let profiles = DEFAULT_DEMO_PROFILES;
      if (savedProfilesRaw) {
        profiles = JSON.parse(savedProfilesRaw);
      } else {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(DEFAULT_DEMO_PROFILES));
      }
      setDemoProfiles(profiles);

      const activeRaw = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        setCurrentUser(active);
        setIsOnboarded(true);
      } else {
        // First-time visit: no user active
        setCurrentUser(null);
        setIsOnboarded(false);
      }
    } catch (e) {
      console.error('Error loading user profile from localStorage:', e);
      setCurrentUser(DEFAULT_DEMO_PROFILES[0]);
      setIsOnboarded(true);
    }
  }, []);

  const createUser = (name, favoriteGenres) => {
    const trimmedName = name.trim() || 'Gamer';
    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId,
      name: trimmedName,
      username: trimmedName.toLowerCase().replace(/\s+/g, '_'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
      favoriteGenres: favoriteGenres.length ? favoriteGenres : ['Action', 'RPG'],
    };

    const updatedProfiles = [...demoProfiles.filter((p) => p.id !== newId), newUser];
    setDemoProfiles(updatedProfiles);
    setCurrentUser(newUser);
    setIsOnboarded(true);

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(updatedProfiles));
    } catch (e) {
      console.error('Error saving new profile:', e);
    }
  };

  const updateUser = (updatedFields) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      ...updatedFields,
      username: (updatedFields.name || currentUser.name).toLowerCase().replace(/\s+/g, '_'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updatedFields.name || currentUser.name)}`,
    };

    setCurrentUser(updated);

    const updatedProfiles = demoProfiles.map((p) => (p.id === updated.id ? updated : p));
    setDemoProfiles(updatedProfiles);

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(updatedProfiles));
    } catch (e) {
      console.error('Error updating profile:', e);
    }
  };

  const switchUser = (profileId) => {
    const target = demoProfiles.find((p) => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      setIsOnboarded(true);
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(target));
      } catch (e) {
        console.error('Error switching user:', e);
      }
    }
  };

  const resetDemoUser = () => {
    setCurrentUser(null);
    setIsOnboarded(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    } catch (e) {
      console.error('Error resetting user:', e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        demoProfiles,
        isOnboarded,
        createUser,
        updateUser,
        switchUser,
        resetDemoUser,
        allGenres: GENRES,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
