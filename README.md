# 🛒 Navix Grocery Store

A full-stack online grocery store application built with **React**, **FastAPI**, **PostgreSQL**, and **Docker**.

---

## 📌 What is this project?

Navix is a complete grocery shopping web app where:
- 👤 Users can **register, login**, browse products, add them to cart, and place orders.
- 🛠️ Admins can **manage products, categories, and orders** from a dedicated admin panel.
- 💾 All data is stored in a **PostgreSQL** database.
- 🚀 Everything runs together using **Docker Compose** — one command and you're done!

---

## 🗂️ Project Structure

```
Grocery/
├── frontend/           → React app (what users see in the browser)
├── backend-fastapi/    → FastAPI server (handles all API logic)
├── database/           → SQL files to set up the database tables & seed data
├── nginx/              → Nginx config (acts as a reverse proxy)
├── docker-compose.yml  → Runs all services together
```

---

## 🧰 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite, TailwindCSS, React Router |
| Backend    | Python, FastAPI, SQLAlchemy (async) |
| Database   | PostgreSQL 15                     |
| Auth       | JWT (JSON Web Tokens)             |
| Proxy      | Nginx                             |
| Container  | Docker & Docker Compose           |

---

## ✅ Prerequisites (Things you need before starting)

Make sure you have these installed on your computer:

1. **Docker Desktop** → [Download here](https://www.docker.com/products/docker-desktop/)
2. **Git** → [Download here](https://git-scm.com/)

> 💡 You do **NOT** need Python or Node.js installed separately — Docker handles everything inside containers!

---

## 🚀 Getting Started (Step by Step)

### Step 1 — Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/your-username/Grocery.git
cd Grocery
```

---

### Step 2 — Start the Application

Just run this single command:

```bash
docker compose up --build
```

This will:
- 🐳 Build the frontend and backend Docker images
- 🐘 Start PostgreSQL and auto-create all tables
- 🌱 Seed the database with sample products and categories
- 🌐 Start all services

> ⏳ First time setup may take **2–5 minutes** as Docker downloads all dependencies.

---

### Step 3 — Open the App

Once everything is running, open your browser:

| Service         | URL                              |
|-----------------|----------------------------------|
| 🌐 App (via Nginx) | http://localhost               |
| ⚛️ Frontend (direct) | http://localhost:3000        |
| ⚙️ Backend API  | http://localhost:8000            |
| 📄 API Docs     | http://localhost:8000/docs       |

---

### Step 4 — Login as Admin

A default admin account is automatically created when the app starts:

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@navix.com`  |
| Password | `Admin@1234`       |

> 🔐 Change this password in production!

---

## 🛑 Stopping the App

To stop all running containers:

```bash
docker compose down
```

To stop **and also delete the database data** (fresh start):

```bash
docker compose down -v
```

---

## 🔧 Running Without Docker (Manual Setup)

If you prefer to run the frontend and backend separately on your machine:

### Backend

```bash
cd backend-fastapi

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the example env file and fill in your values
cp .env.example .env

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

> ⚠️ You will need a running **PostgreSQL** database and update the `DATABASE_URL` in `backend-fastapi/.env` accordingly.

---

## ⚙️ Environment Variables

The backend uses environment variables for configuration. Copy the example file:

```bash
cp backend-fastapi/.env.example backend-fastapi/.env
```

| Variable                    | Description                              | Default                  |
|-----------------------------|------------------------------------------|--------------------------|
| `DATABASE_URL`              | PostgreSQL connection string             | *(see .env.example)*     |
| `SECRET_KEY`                | Secret key for signing JWT tokens        | *(must be 32+ chars)*    |
| `ALGORITHM`                 | JWT algorithm                            | `HS256`                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | How long a login session lasts         | `60`                     |
| `ENVIRONMENT`               | `development` or `production`            | `development`            |
| `ALLOWED_ORIGINS`           | Comma-separated list of allowed origins  | `http://localhost:3000`  |

---

## 🗄️ Database Overview

The database has these main tables:

| Table         | Purpose                                    |
|---------------|--------------------------------------------|
| `users`       | Stores user accounts (customers + admins)  |
| `categories`  | Product categories (e.g. Fruits, Dairy)    |
| `products`    | All grocery products with price & stock    |
| `carts`       | One cart per user                          |
| `cart_items`  | Items inside a user's cart                 |
| `orders`      | Placed orders with delivery address        |
| `order_items` | Individual items within each order         |
| `payments`    | Payment records for each order             |

---

## 📡 API Endpoints Summary

The full interactive API documentation is available at **http://localhost:8000/docs**

| Module       | Key Endpoints                                    |
|--------------|--------------------------------------------------|
| 🔐 Auth      | `POST /api/register`, `POST /api/login`          |
| 👤 Users     | `GET /api/users/me`, `PUT /api/users/me`         |
| 📦 Products  | `GET /api/products`, `GET /api/products/{id}`    |
| 🗂️ Categories | `GET /api/categories`                           |
| 🛒 Cart      | `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/{id}` |
| 📋 Orders    | `POST /api/orders`, `GET /api/orders`            |
| 🛠️ Admin     | `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` |

---

## 🐳 Docker Services

| Container         | Role                              | Port  |
|-------------------|-----------------------------------|-------|
| `navix-postgres`  | PostgreSQL database               | 5432  |
| `navix-backend`   | FastAPI application               | 8000  |
| `navix-frontend`  | React app (served via Nginx)      | 3000  |
| `navix-nginx`     | Reverse proxy (main entry point)  | 80    |

---

## 🤔 Common Issues & Fixes

### ❌ Port already in use
If you see an error like `port 8000 already in use`, stop any other apps using that port:
```bash
lsof -i :8000   # Find the process
kill -9 <PID>   # Kill it
```

### ❌ Database connection error
Make sure Docker is running and PostgreSQL container is healthy:
```bash
docker compose ps   # Check container status
docker compose logs postgres   # View database logs
```

### ❌ Frontend shows blank page
Wait a moment — the backend might still be starting. Check:
```bash
docker compose logs backend
```

### 🔄 Apply code changes without rebuilding
Since the backend uses a live-mounted volume, code changes apply automatically with hot-reload. For frontend, run:
```bash
docker compose restart frontend
```

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| [`docker-compose.yml`](./docker-compose.yml) | Defines and connects all Docker services |
| [`backend-fastapi/app/main.py`](./backend-fastapi/app/main.py) | FastAPI app entry point |
| [`backend-fastapi/requirements.txt`](./backend-fastapi/requirements.txt) | Python dependencies |
| [`backend-fastapi/.env.example`](./backend-fastapi/.env.example) | Environment variables template |
| [`database/schema.sql`](./database/schema.sql) | Database table definitions |
| [`database/seed.sql`](./database/seed.sql) | Sample data for development |
| [`frontend/src/App.jsx`](./frontend/src/App.jsx) | React app root with routing |

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "Add: your feature description"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

