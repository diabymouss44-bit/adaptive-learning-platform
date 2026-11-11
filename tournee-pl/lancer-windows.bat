@echo off
cd /d "%~dp0"
title Tournee PL
rem Python si disponible (le faux "python" du Microsoft Store est ignore), sinon PowerShell
py -3 -c "import sys" >nul 2>nul && (py -3 serveur.py & goto :eof)
python -c "import sys" >nul 2>nul && (python serveur.py & goto :eof)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serveur.ps1"
