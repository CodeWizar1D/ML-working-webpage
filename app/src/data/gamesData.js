import initialGames from './initialGames.json';

export const USER = {
  username: 'JaiHarish',
  displayName: 'Jai Harish',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaiHarish',
  favoriteGenres: ['Action', 'RPG', 'Adventure', 'Strategy', 'Indie'],
  gamesPlayed: 300,
  hoursPlayed: 1420,
  mlProfileScore: 96,
};

export const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Racing',
  'Sports',
  'Horror',
  'Puzzle',
  'Fighting',
  'Casual',
  'Indie',
  'Shooter',
  'Free to Play',
];

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop';

// In-memory games dataset (starts with lightweight 8KB 12-game initial set for instant first paint)
export let games = [...initialGames];

// Index map for instant O(1) lookups
let GAME_MAP = new Map(games.map((g) => [g.id, g]));
let HERO_GAMES = games.filter((g) => g.hero).slice(0, 6);
let FEATURED_GAMES = games.slice(0, 12);
let TRENDING_GAMES = [...games].sort((a, b) => b.peak_ccu - a.peak_ccu).slice(0, 12);
let TOP_RATED_GAMES = [...games].sort((a, b) => b.rating - a.rating).slice(0, 12);

let fullDatasetPromise = null;

export function loadFullDataset() {
  if (fullDatasetPromise) return fullDatasetPromise;
  fullDatasetPromise = fetch('/data/games-lite.json')
    .then((res) => res.json())
    .then((fullGames) => {
      if (Array.isArray(fullGames) && fullGames.length > 0) {
        games = fullGames;
        GAME_MAP = new Map(games.map((g) => [g.id, g]));
        HERO_GAMES = games.filter((g) => g.hero).slice(0, 6);
        FEATURED_GAMES = games.slice(0, 20);
        TRENDING_GAMES = [...games].sort((a, b) => b.peak_ccu - a.peak_ccu).slice(0, 20);
        TOP_RATED_GAMES = [...games].sort((a, b) => b.rating - a.rating).slice(0, 30);
      }
      return games;
    })
    .catch((err) => {
      console.warn('Could not load full dataset async, using initial set:', err);
      return games;
    });
  return fullDatasetPromise;
}

// Automatically trigger background async load of 300 games without blocking script execution
if (typeof window !== 'undefined') {
  setTimeout(loadFullDataset, 100);
}

export function getGameById(id) {
  return GAME_MAP.get(String(id));
}

export function getHeroGames() {
  return HERO_GAMES;
}

export function getFeaturedGames() {
  return FEATURED_GAMES;
}

export function getTrendingGames() {
  return TRENDING_GAMES;
}

export function getTopRatedGames() {
  return TOP_RATED_GAMES;
}

export async function fetchMLRecommendations(selectedGenres = []) {
  try {
    const query = selectedGenres.length ? selectedGenres.join(',') : '';
    const res = await fetch(`http://localhost:5000/api/recommendations?genres=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // API offline fallback to local real games
  }
  await loadFullDataset();
  return getRecommendationsLocal(selectedGenres);
}

export function getRecommendationsLocal(selectedGenres = []) {
  const selectedLower = (selectedGenres || []).map((sg) => sg.toLowerCase().trim());
  let pool = games.map((g) => {
    const cats = [...(g.genre || []), ...(g.tags || []), ...(g.genres || [])].map((c) => String(c).toLowerCase().trim());
    const aboutText = (g.description || g.about || '').toLowerCase();
    const titleText = (g.title || g.name || '').toLowerCase();

    let overlap = 0;
    for (const sg of selectedLower) {
      if (cats.some((c) => c.includes(sg) || sg.includes(c)) || aboutText.includes(sg) || titleText.includes(sg)) {
        overlap += 1;
      }
    }

    let matchPct = 85;
    if (selectedLower.length > 0) {
      if (overlap > 0) {
        matchPct = Math.min(99, Math.max(78, 80 + overlap * 5 + Math.round((g.rating || 8) * 1.5)));
      } else {
        matchPct = Math.min(75, Math.max(60, 62 + Math.round((g.rating || 8) * 1.2)));
      }
    } else {
      matchPct = Math.min(98, Math.max(82, 82 + Math.round((g.rating || 8) * 1.5)));
    }

    return { ...g, matchPercent: matchPct, overlap };
  });

  if (selectedLower.length > 0) {
    const matching = pool.filter((g) => g.overlap > 0);
    if (matching.length > 0) {
      return matching.sort((a, b) => b.overlap - a.overlap || b.matchPercent - a.matchPercent || b.rating - a.rating);
    }
  }

  return pool.sort((a, b) => b.matchPercent - a.matchPercent || b.rating - a.rating);
}

export function searchGames(query) {
  const q = query.toLowerCase().trim();
  if (!q) return games;
  return games.filter((g) => {
    const titleMatch = (g.title || g.name || '').toLowerCase().includes(q);
    const gGenres = Array.isArray(g.genre) ? g.genre : (Array.isArray(g.genres) ? g.genres : []);
    const genreMatch = gGenres.some((tag) => String(tag).toLowerCase().includes(q));
    const devMatch = (g.developer || '').toLowerCase().includes(q);
    const gTags = Array.isArray(g.tags) ? g.tags : [];
    const tagMatch = gTags.some((t) => String(t).toLowerCase().includes(q));
    return titleMatch || genreMatch || devMatch || tagMatch;
  });
}
