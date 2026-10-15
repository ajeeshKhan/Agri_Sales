# 🌾 AgriSales Platform - Portable Executable Package

A complete, self-contained **Python Django** e-commerce platform with multi-role authentication (Buyer, Farmer/Seller, Agri-Merchant, Admin), produce marketplace, farmer inputs store, checkout gateway, live order tracking, and full Admin CRUD management.

---

## 💻 How to Run on Any New PC

### 🪟 Windows (1-Click Launch)
1. Copy or extract the project folder onto the new PC.
2. Ensure **Python** (version 3.10 or higher) is installed on the computer ([python.org](https://www.python.org/downloads/)). *Make sure to check "Add Python to PATH" during installation.*
3. **Double-click `run.bat`**.

That's it! `run.bat` will automatically:
- Create the Python virtual environment (`.venv`)
- Install all required packages (`requirements.txt`)
- Perform database migrations and seed default accounts & produce catalog into SQLite
- Open your browser to **`http://127.0.0.1:8000/`** automatically!

---

### 🍏 Mac / Linux (1-Click Launch)
1. Open Terminal in the project directory.
2. Grant execution permissions and run:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

---

## 🔑 Default Login Credentials Matrix

| Account Role | Dropdown Selection | Email | Password | Role Details |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin` | `admin@agrisales.com` | `Admin@1234` | Master Key: `ADMIN-2026-KEY` |
| 🚜 **Farmer / Seller** | `seller` | `farmer@greenacres.com` | `Farmer@1234` | Farm: Green Acres Organic |
| 🛒 **Buyer** | `buyer` | `buyer@freshmarket.com` | `Buyer@1234` | Wholesale Purchaser |
| 🧪 **Agri-Merchant** | `merchant` | `merchant@agrisupply.com` | `Merchant@1234` | Store: Kisan Agri Supplies |

---

## 🛠️ Manual Terminal Command Setup (Alternative)

If you prefer running commands manually in terminal:

```bash
# 1. Navigate to backend directory
cd agrisales_backend

# 2. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # On Mac/Linux
.venv\Scripts\activate           # On Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Migrate Database & Seed Initial Data
python manage.py makemigrations agrisales_app
python manage.py migrate
python manage.py seed_data

# 5. Start Development Server
python manage.py runserver 8000
```

- App URL: **`http://127.0.0.1:8000/`**
- Django SuperAdmin Panel: **`http://127.0.0.1:8000/admin/`**
