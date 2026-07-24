"""
Python API Backend Server for GAMEZONE AI
Provides /api/games, /api/recommendations, /api/similar endpoints
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from recommender import MLRecommender

# Initialize ML recommender
recommender = MLRecommender()


class APIHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # GET /api/games
        if path == '/api/games':
            return self._send_json(recommender.games)

        # GET /api/recommendations
        elif path == '/api/recommendations':
            genres_raw = params.get('genres', [''])[0]
            user_genres = [g.strip() for g in genres_raw.split(',') if g.strip()]
            recs = recommender.get_recommendations_by_genres(user_genres, top_n=30)
            return self._send_json(recs)

        # GET /api/similar/<id>
        elif path.startswith('/api/similar/'):
            game_id = path.split('/api/similar/')[-1]
            similar = recommender.get_similar_games(game_id, top_n=6)
            return self._send_json(similar)

        # GET /api/games/<id>
        elif path.startswith('/api/games/'):
            game_id = path.split('/api/games/')[-1]
            game = recommender.games_by_id.get(str(game_id))
            if game:
                return self._send_json(game)
            return self._send_json({"error": "Game not found"}, status=404)

        # 404 Fallback
        else:
            return self._send_json({"error": "Endpoint not found"}, status=404)

    def log_message(self, format, *args):
        # Silent logging for speed
        pass


def run_server(port=5000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    print(f"GAMEZONE AI Python ML Backend running at http://localhost:{port}")
    httpd.serve_forever()


if __name__ == '__main__':
    run_server(5000)
