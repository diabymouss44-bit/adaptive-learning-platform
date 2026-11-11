#!/bin/sh
# Lance Tournée PL sur http://localhost:8765 (double-clic ou : sh lancer-mac-linux.sh)
cd "$(dirname "$0")" || exit 1
if command -v python3 >/dev/null 2>&1; then exec python3 serveur.py "$@"; fi
if command -v python >/dev/null 2>&1; then exec python serveur.py "$@"; fi
echo "Python 3 est nécessaire (https://www.python.org/downloads/)."; exit 1
