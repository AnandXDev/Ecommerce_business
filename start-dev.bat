@echo off
echo Starting Dropship Ecommerce Development Servers...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Starting database services...
docker-compose up -d mongodb redis

echo Waiting for databases to be ready...
timeout /t 10

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers are starting up...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to stop all servers...
pause

echo Stopping servers...
docker-compose down

echo Done!
