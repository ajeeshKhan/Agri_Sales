@echo off
TITLE AgriSales Platform - Automatic Server Launcher
COLOR 0A
echo ======================================================================
echo                  AGRISALES PLATFORM AUTO LAUNCHER                     
echo ======================================================================
echo.

:: Step 1: Locate Python
WHERE python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    WHERE py >nul 2>nul
    IF %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Python is not installed or not added to PATH.
        echo Please install Python 3.10 or higher from https://python.org
        echo Make sure to check "Add Python to PATH" during installation.
        pause
        exit /b 1
    ) ELSE (
        SET PYTHON_CMD=py
    )
) ELSE (
    SET PYTHON_CMD=python
)

echo [1/4] Using Python executable: %PYTHON_CMD%

:: Step 2: Check & Create Virtual Environment
IF NOT EXIST ".venv" (
    echo [2/4] Creating virtual environment (.venv)...
    %PYTHON_CMD% -m venv .venv
    IF %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
) ELSE (
    echo [2/4] Virtual environment found (.venv).
)

:: Activate Virtual Environment
CALL .venv\Scripts\activate

:: Step 3: Install Dependencies
echo [3/4] Installing required dependencies...
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

:: Step 4: Run Migrations & Data Seeding
echo [4/4] Setting up SQLite Database & Default Users...
python manage.py makemigrations agrisales_app --noinput
python manage.py migrate --noinput
python manage.py seed_data

echo.
echo ======================================================================
echo       SUCCESS! AgriSales Server is starting at http://127.0.0.1:8000
echo ======================================================================
echo.
echo Default Logins:
echo   - Buyer:    buyer@freshmarket.com   / Buyer@1234
echo   - Farmer:   farmer@greenacres.com   / Farmer@1234
echo   - Merchant: merchant@agrisupply.com / Merchant@1234
echo   - Admin:    admin@agrisales.com      / Admin@1234 (Key: ADMIN-2026-KEY)
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

:: Automatically open default browser after 2 seconds
start "" http://127.0.0.1:8000/

:: Start Django Server
python manage.py runserver 8000

pause
