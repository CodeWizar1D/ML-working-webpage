import rawGames from '../../data/games.json';

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

// Fallback image if cover fails
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop';

// Map real raw games (300 curated titles) to GAMEZONE UI component props
export const games = rawGames.map((g, idx) => {
  const ratingVal = g.score > 0 ? g.score : (8.2 + (idx % 12) * 0.1);
  const totalRev = (g.positive || 0) + (g.negative || 0);
  const posRatio = totalRev > 0 ? (g.positive / totalRev) : 0.85;
  const matchPct = Math.min(99, Math.max(78, Math.round(ratingVal * 8.5 + (g.positive > 20000 ? 5 : 2))));

  // Normalized Platform Rule: Every game is a Steam PC game ("pc"), Mac/Linux added if true in dataset
  const platforms = ['pc'];
  if (g.mac || g.apple) platforms.push('mac');
  if (g.linux) platforms.push('linux');

  let tone = 'positive';
  let label = 'Very Positive';
  if (posRatio >= 0.90) {
    label = 'Overwhelmingly Positive';
    tone = 'positive';
  } else if (posRatio < 0.70) {
    label = 'Mixed';
    tone = 'mixed';
  }

  const combinedGenres = g.tags && g.tags.length ? g.tags : (g.genres && g.genres.length ? g.genres : ['Action']);

  return {
    id: String(g.id),
    title: g.name || 'Untitled Game',
    subtitle: combinedGenres.slice(0, 3).join(' · '),
    rating: parseFloat(ratingVal.toFixed(1)),
    stars: Math.min(5, Math.max(3, Math.round(ratingVal / 2))),
    editorsChoice: ratingVal >= 9.0 || g.peak_ccu > 30000,
    genre: combinedGenres,
    tags: g.tags || [],
    platforms: platforms,
    trending: g.peak_ccu > 2000 || g.positive > 15000,
    featured: idx < 15 || g.score >= 8.5,
    hero: idx < 6,
    image: g.image || FALLBACK_IMAGE,
    cover: g.image || FALLBACK_IMAGE,
    description: g.about || `Experience ${g.name}, featuring immersive gameplay and dynamic Steam multiplayer options.`,
    matchPercent: matchPct,
    aiInsight: {
      label: label,
      score: Math.round(posRatio * 100),
      tone: tone
    },
    releaseYear: String(g.year || '2024'),
    developer: g.developer || 'Game Studio',
    positive: g.positive || 0,
    negative: g.negative || 0,
    peak_ccu: g.peak_ccu || 0
  };
});

// Pre-computed lookup index & cached game lists for instant initial rendering
const GAME_MAP = new Map(games.map((g) => [g.id, g]));
const HERO_GAMES = games.filter((g) => g.hero).slice(0, 6);
const FEATURED_GAMES = games.slice(0, 20);
const TRENDING_GAMES = [...games].sort((a, b) => b.peak_ccu - a.peak_ccu).slice(0, 20);
const TOP_RATED_GAMES = [...games].sort((a, b) => b.rating - a.rating).slice(0, 30);

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
