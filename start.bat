@echo off
title Launching GAMEZONE AI + Python ML Recommender...

echo ========================================================
echo   Starting GAMEZONE AI Application
echo ========================================================
echo.

:: Change to app directory relative to script location
cd /d "%~dp0app"

:: Ensure Node.js is accessible
set "PATH=%PATH%;C:\Program Files\nodejs"

echo [1/2] Launching Python ML API Backend (Port 5000)...
start "GAMEZONE Python ML Backend" cmd /k "cd /d ""%~dp0app"" && py server.py"

echo [2/2] Launching React Vite Frontend (Port 5173)...
start "GAMEZONE React Frontend" cmd /k "cd /d ""%~dp0app"" && set ""PATH=%%PATH%%;C:\Program Files\nodejs"" && npm run dev"

echo.
echo Launching Web Browser at http://localhost:5173/ ...
timeout /t 3 >nul
start http://localhost:5173/

echo.
echo Application is running! Keep both command windows open while using the site.
