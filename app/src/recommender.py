"""
ML-Based Personalized Game Recommendation Engine
Uses TF-IDF Vectorization and Cosine Similarity on games dataset attributes.
"""

import json
from pathlib import Path

try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def load_dataset():
    data_path = Path(__file__).resolve().parent.parent / "data" / "games.json"
    if not data_path.exists():
        data_path = Path(__file__).resolve().parent / "data" / "games.json"
    
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


class MLRecommender:
    def __init__(self):
        self.games = load_dataset()
        self.games_by_id = {str(g["id"]): g for g in self.games}
        self._build_feature_matrix()

    def _build_feature_matrix(self):
        """Construct text metadata for TF-IDF matrix generation."""
        self.descriptions = []
        for g in self.games:
            genres_str = " ".join(g.get("genres", []))
            tags_str = " ".join(g.get("tags", []))
            about_str = g.get("about", "")
            dev_str = g.get("developer", "")
            
            doc = f"{genres_str} {genres_str} {tags_str} {dev_str} {about_str}"
            self.descriptions.append(doc)

        if SKLEARN_AVAILABLE:
            self.vectorizer = TfidfVectorizer(stop_words='english')
            self.tfidf_matrix = self.vectorizer.fit_transform(self.descriptions)
            self.similarity_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        else:
            self.vectorizer = None
            self.similarity_matrix = None

    def _transform_game(self, g, sim_score=0.0, user_genres=None):
        """Map raw dataset object to clean component props."""
        user_genres_lower = [ug.lower().strip() for ug in (user_genres or [])]
        game_categories = [c.lower().strip() for c in (g.get("genres", []) + g.get("tags", []))]
        about_text = g.get("about", "").lower()
        title_text = g.get("name", "").lower()

        # Count genre match overlap
        overlap = 0
        for ug in user_genres_lower:
            if any(ug in cat for cat in game_categories) or ug in about_text or ug in title_text:
                overlap += 1

        rating = float(g.get("score", 8.0) or 8.0)
        pos = int(g.get("positive", 0) or 0)
        neg = int(g.get("negative", 0) or 0)
        total_rev = (pos + neg) or 1
        pos_ratio = pos / total_rev

        # Calculate dynamic match % (varies by sim_score, rating, and overlap)
        if user_genres_lower:
            if overlap > 0:
                base = 80 + (overlap * 4) + (sim_score * 30) + (rating * 1.2)
            else:
                base = 65 + (rating * 1.5)
        else:
            base = 82 + (sim_score * 35) + (rating * 1.5)

        match_percent = int(min(99, max(68, round(base))))

        label = "Overwhelmingly Positive" if pos_ratio >= 0.9 else ("Very Positive" if pos_ratio >= 0.75 else "Mixed")

        platforms = []
        if g.get("windows"): platforms.append("windows")
        if g.get("mac"): platforms.append("apple")
        if g.get("linux"): platforms.append("linux")
        if not platforms: platforms.append("windows")

        display_genres = g.get("tags", []) if g.get("tags") else g.get("genres", ["Action"])

        return {
            "id": str(g.get("id")),
            "title": g.get("name", "Untitled Game"),
            "subtitle": " · ".join(display_genres[:2]) if display_genres else "Steam Game",
            "rating": round(rating, 1),
            "stars": min(5, max(3, round(rating / 2))),
            "genre": display_genres[:4],
            "tags": g.get("tags", [])[:6],
            "platforms": platforms,
            "image": g.get("image", ""),
            "cover": g.get("image", ""),
            "description": g.get("about", ""),
            "matchPercent": match_percent,
            "aiInsight": {
                "label": label,
                "score": int(round(pos_ratio * 100)),
                "tone": "positive" if pos_ratio >= 0.75 else "mixed"
            },
            "releaseYear": str(g.get("year", "2024")),
            "developer": g.get("developer", "Studio"),
            "positive": pos,
            "negative": neg,
            "peak_ccu": g.get("peak_ccu", 0),
            "overlap": overlap
        }

    def get_recommendations_by_genres(self, user_genres, top_n=30):
        """Content-based recommendation based on user selected genre preferences."""
        user_genres_lower = [ug.lower().strip() for ug in (user_genres or [])]
        
        if SKLEARN_AVAILABLE and self.vectorizer is not None and user_genres:
            user_query = " ".join(user_genres)
            query_vec = self.vectorizer.transform([user_query])
            sim_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
            
            scored_games = []
            for idx, g in enumerate(self.games):
                sim = float(sim_scores[idx])
                transformed = self._transform_game(g, sim_score=sim, user_genres=user_genres)
                scored_games.append(transformed)
        else:
            scored_games = [self._transform_game(g, user_genres=user_genres) for g in self.games]

        # If user explicitly selected genres, strictly filter to matching games
        if user_genres_lower:
            matching = [g for g in scored_games if g["overlap"] > 0]
            if matching:
                matching.sort(key=lambda x: (x["overlap"], x["matchPercent"], x["rating"]), reverse=True)
                return matching[:top_n]

        # Default fallback sorted by matchPercent & rating
        scored_games.sort(key=lambda x: (x["matchPercent"], x["rating"]), reverse=True)
        return scored_games[:top_n]

    def get_similar_games(self, game_id, top_n=6):
        """Find top N similar games using TF-IDF cosine similarity."""
        game_id_str = str(game_id)
        idx_map = {str(g["id"]): i for i, g in enumerate(self.games)}
        
        if game_id_str not in idx_map or not SKLEARN_AVAILABLE:
            # Fallback by genre match
            target = self.games_by_id.get(game_id_str)
            if not target: return []
            t_genres = set(target.get("genres", []) + target.get("tags", []))
            similar = []
            for g in self.games:
                if str(g["id"]) == game_id_str: continue
                if set(g.get("genres", []) + g.get("tags", [])) & t_genres:
                    similar.append(self._transform_game(g))
                if len(similar) >= top_n: break
            return similar

        target_idx = idx_map[game_id_str]
        sim_scores = self.similarity_matrix[target_idx]
        
        ranked = sorted(enumerate(sim_scores), key=lambda x: x[1], reverse=True)
        similar = []
        for i, score in ranked:
            if i == target_idx:
                continue
            similar.append(self._transform_game(self.games[i], sim_score=float(score)))
            if len(similar) >= top_n:
                break
        return similar


if __name__ == "__main__":
    recommender = MLRecommender()
    print(f"ML Recommender Initialized. Dataset size: {len(recommender.games)} games.")
    for test_g in [["Racing"], ["Horror"], ["RPG"], ["Action", "RPG"]]:
        recs = recommender.get_recommendations_by_genres(test_g, top_n=3)
        print(f"\nTop recommendations for {test_g}:")
        for r in recs:
            print(f"  - {r['title']} ({r['matchPercent']}% match) | Genres: {r['genre']}")
