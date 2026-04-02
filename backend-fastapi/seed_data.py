"""
Seed script — inserts 6 categories + 2 products each into Supabase.
Run from backend-fastapi directory:
    python seed_data.py
"""
import os, psycopg2
from dotenv import load_dotenv

load_dotenv()

url = (
    os.getenv("DATABASE_URL", "")
    .replace("postgresql+asyncpg://", "postgresql://")
    .replace(":6543/", ":5432/")
)

conn = psycopg2.connect(url)
conn.autocommit = True
cur = conn.cursor()

# ─── Categories ───────────────────────────────────────────────────────────────
CATEGORIES = [
    ("Fruits & Vegetables", "fruits-vegetables",  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400"),
    ("Dairy & Eggs",        "dairy-eggs",          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"),
    ("Beverages",           "beverages",           "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400"),
    ("Snacks",              "snacks-namkeen",      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400"),
    ("Bakery & Bread",      "bakery-bread",        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"),
    ("Spices & Masala",     "spices-masala",       "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400"),
]

print("Inserting categories...")
for name, slug, img in CATEGORIES:
    cur.execute("""
        INSERT INTO categories (name, slug, image_url)
        VALUES (%s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, (name, slug, img))

# Fetch category id map
cur.execute("SELECT id, slug FROM categories")
cat_map = {slug: cid for cid, slug in cur.fetchall()}
print(f"  Category IDs: {cat_map}")

# ─── Products ─────────────────────────────────────────────────────────────────
PRODUCTS = [
    # Fruits & Vegetables
    {
        "name": "Fresh Spinach",
        "slug": "fresh-spinach",
        "description": "Crispy, farm-fresh spinach leaves. Rich in iron and vitamins.",
        "price": 29.00,
        "discount_price": 25.00,
        "stock": 100,
        "unit": "250 g",
        "category_slug": "fruits-vegetables",
        "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    },
    {
        "name": "Bananas",
        "slug": "bananas",
        "description": "Sweet ripe bananas — a perfect energy-boosting snack.",
        "price": 49.00,
        "discount_price": 40.00,
        "stock": 80,
        "unit": "6 pcs",
        "category_slug": "fruits-vegetables",
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    },

    # Dairy & Eggs
    {
        "name": "Full Cream Milk",
        "slug": "full-cream-milk",
        "description": "Farm-fresh full cream milk, pasteurised and homogenised.",
        "price": 60.00,
        "discount_price": None,
        "stock": 50,
        "unit": "1 litre",
        "category_slug": "dairy-eggs",
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    },
    {
        "name": "Farm Eggs",
        "slug": "farm-eggs",
        "description": "Free-range brown eggs, fresh from local farms.",
        "price": 80.00,
        "discount_price": 72.00,
        "stock": 60,
        "unit": "6 eggs",
        "category_slug": "dairy-eggs",
        "image_url": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400",
    },

    # Beverages
    {
        "name": "Orange Juice",
        "slug": "orange-juice",
        "description": "100% natural cold-pressed orange juice, no added sugar.",
        "price": 99.00,
        "discount_price": 89.00,
        "stock": 45,
        "unit": "1 litre",
        "category_slug": "beverages",
        "image_url": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
    },
    {
        "name": "Green Tea",
        "slug": "green-tea",
        "description": "Premium Darjeeling green tea — light, refreshing, antioxidant-rich.",
        "price": 149.00,
        "discount_price": 129.00,
        "stock": 70,
        "unit": "25 bags",
        "category_slug": "beverages",
        "image_url": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400",
    },

    # Snacks & Namkeen
    {
        "name": "Aloo Bhujia",
        "slug": "aloo-bhujia",
        "description": "Classic crispy potato sev, perfectly salted and spiced.",
        "price": 35.00,
        "discount_price": 30.00,
        "stock": 120,
        "unit": "200 g",
        "category_slug": "snacks-namkeen",
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
    },
    {
        "name": "Mixed Nuts",
        "slug": "mixed-nuts",
        "description": "Premium assorted roasted nuts — almonds, cashews, walnuts.",
        "price": 199.00,
        "discount_price": 179.00,
        "stock": 40,
        "unit": "150 g",
        "category_slug": "snacks-namkeen",
        "image_url": "https://images.unsplash.com/photo-1548346824-2c2e-4d6c-bc75-3e64b46fa680?w=400",
    },

    # Bakery & Bread
    {
        "name": "Whole Wheat Bread",
        "slug": "whole-wheat-bread",
        "description": "Soft, freshly baked whole wheat bread. No preservatives.",
        "price": 45.00,
        "discount_price": 40.00,
        "stock": 30,
        "unit": "400 g loaf",
        "category_slug": "bakery-bread",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    },
    {
        "name": "Butter Croissant",
        "slug": "butter-croissant",
        "description": "Flaky, golden, buttery croissants baked fresh every morning.",
        "price": 55.00,
        "discount_price": None,
        "stock": 25,
        "unit": "2 pcs",
        "category_slug": "bakery-bread",
        "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    },

    # Spices & Masala
    {
        "name": "Turmeric Powder",
        "slug": "turmeric-powder",
        "description": "Pure, organic haldi powder with rich golden colour and natural aroma.",
        "price": 55.00,
        "discount_price": 49.00,
        "stock": 90,
        "unit": "200 g",
        "category_slug": "spices-masala",
        "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
    },
    {
        "name": "Garam Masala",
        "slug": "garam-masala",
        "description": "Authentic blend of whole spices, slow-roasted and ground to perfection.",
        "price": 79.00,
        "discount_price": 69.00,
        "stock": 75,
        "unit": "100 g",
        "category_slug": "spices-masala",
        "image_url": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400",
    },
]

print("\nInserting products...")
inserted = 0
for p in PRODUCTS:
    cat_id = cat_map.get(p["category_slug"])
    if not cat_id:
        print(f"  ⚠ Category not found for slug: {p['category_slug']}")
        continue
    cur.execute("""
        INSERT INTO products
            (name, slug, description, price, discount_price, stock, unit, category_id, image_url, is_active)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE)
        ON CONFLICT (slug) DO NOTHING
    """, (
        p["name"], p["slug"], p["description"], p["price"],
        p.get("discount_price"), p["stock"], p["unit"], cat_id, p["image_url"]
    ))
    inserted += 1
    print(f"  ✅ {p['name']}")

cur.close()
conn.close()
print(f"\n🎉 Done! {inserted} products seeded across {len(CATEGORIES)} categories.")
