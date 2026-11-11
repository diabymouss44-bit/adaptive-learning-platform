#!/usr/bin/env python3
"""Petit serveur local pour Tournée PL : http://localhost:8765
Nécessaire pour installer l'application et l'utiliser hors ligne
(un navigateur n'autorise pas l'installation depuis un simple fichier)."""
import http.server, os, socketserver, sys, webbrowser

PORT = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8765))
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".webmanifest": "application/manifest+json", ".js": "text/javascript",
                      ".svg": "image/svg+xml", ".html": "text/html; charset=utf-8"}
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()
    def log_message(self, *a):
        pass

class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

try:
    srv = Server(("127.0.0.1", PORT), Handler)
except OSError:
    print(f"Le port {PORT} est déjà utilisé : l'application est sans doute déjà lancée.")
    webbrowser.open(f"http://localhost:{PORT}/")
    sys.exit(0)
url = f"http://localhost:{PORT}/"
print(f"Tournée PL tourne sur {url}\nGarde cette fenêtre ouverte. Ctrl+C pour arrêter.")
if os.environ.get("NO_BROWSER") != "1":
    webbrowser.open(url)
try:
    srv.serve_forever()
except KeyboardInterrupt:
    pass
