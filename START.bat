@echo off
REM Quick Start Script for Bitcoin Node Geography Dashboard v2.0.0
REM This script sets up and runs the entire application

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Bitcoin Node Geography Dashboard v2.0.0
echo Quick Start Script (Windows)
echo ========================================
echo.

REM Check for Python
python --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Python not found. Please install Python 3.10 or higher from python.org
    pause
    exit /b 1
)

REM Check for Node.js
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)

echo [OK] Python and Node.js found
echo.

REM Start Backend
echo Starting backend server...
start "Bitcoin Node Geography - Backend" cmd /k "cd backend && .\venv\Scripts\activate.ps1 && python -m uvicorn app.main:app --port 8080 --reload"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak

REM Start Frontend
echo Starting frontend development server...
start "Bitcoin Node Geography - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo [OK] Both servers starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Opening frontend in browser...
timeout /t 3 /nobreak

REM Open in browser
start http://localhost:3000

echo.
echo Dashboard opening in your default browser...
echo.
pause
