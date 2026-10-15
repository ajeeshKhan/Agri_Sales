#!/bin/bash
echo "======================================================================"
echo "                 AGRISALES PLATFORM AUTO LAUNCHER                     "
echo "======================================================================"
echo ""

# Locate Python 3
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "[ERROR] Python 3 is not installed."
    echo "Please install Python 3.10+ from https://python.org"
    exit 1
fi

echo "[1/4] Using Python: $($PYTHON_CMD --version)"

# Check Virtualenv
if [ ! -d ".venv" ]; then
    echo "[2/4] Creating virtual environment (.venv)..."
    $PYTHON_CMD -m venv .venv
fi

# Activate Virtualenv
source .venv/bin/activate

# Install Dependencies
echo "[3/4] Installing dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

# Run Migrations & Data Seeding
echo "[4/4] Setting up SQLite Database & Default Accounts..."
python manage.py makemigrations agrisales_app --noinput
python manage.py migrate --noinput
python manage.py seed_data

echo ""
echo "======================================================================"
echo "      SUCCESS! AgriSales Server starting at http://127.0.0.1:8000     "
echo "======================================================================"
echo ""

# Open default browser
if command -v open &>/dev/null; then
    open http://127.0.0.1:8000/
elif command -v xdg-open &>/dev/null; then
    xdg-open http://127.0.0.1:8000/
fi

python manage.py runserver 8000
