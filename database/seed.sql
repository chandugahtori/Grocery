-- ============================================================
-- Navix Grocery Store — Seed Data
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Fruits & Vegetables', 'fruits-vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
  ('Dairy & Eggs',        'dairy-eggs',        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
  ('Beverages',           'beverages',         'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'),
  ('Snacks & Namkeen',    'snacks-namkeen',    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
  ('Bakery & Bread',      'bakery-bread',      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ('Meat & Seafood',      'meat-seafood',      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400'),
  ('Spices & Masala',     'spices-masala',     'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'),
  ('Packaged Foods',      'packaged-foods',    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400'),
  ('Personal Care',       'personal-care',     'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'),
  ('Cleaning & Household','cleaning-household','https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400');

-- Products — Fruits & Vegetables (category_id = 1)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Fresh Bananas',         'fresh-bananas',         'Farm fresh yellow bananas rich in potassium.',          40,  35,  150, '6 pcs',    1, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'),
  ('Red Apples',            'red-apples',            'Crisp and sweet red apples from Himachal Pradesh.',    120, 109,  80, '1 kg',     1, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'),
  ('Baby Spinach',          'baby-spinach',          'Tender baby spinach leaves, washed and ready to eat.',  45,  40,  60, '200 g',    1, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'),
  ('Cherry Tomatoes',       'cherry-tomatoes',       'Juicy cherry tomatoes perfect for salads.',             55,  NULL, 90, '500 g',   1, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'),
  ('Organic Carrots',       'organic-carrots',       'Certified organic carrots full of beta-carotene.',      60,  55,  120, '500 g',   1, 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400'),
  ('Green Capsicum',        'green-capsicum',        'Fresh green bell peppers for cooking and salads.',      40,  NULL, 100,'250 g',   1, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'),
  ('Watermelon',            'watermelon',            'Sweet seedless watermelon, perfect for summers.',       80,  70,   30, '1 pc ~2kg',1, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400');

-- Products — Dairy & Eggs (category_id = 2)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Full Cream Milk',       'full-cream-milk',       'Fresh pasteurized full cream milk from local farms.',   68,  NULL, 200,'1 L',     2, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
  ('Amul Butter',           'amul-butter',           'Churned fresh butter with a rich taste.',               58,  55,   150,'100 g',   2, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
  ('Greek Yogurt',          'greek-yogurt',          'Thick and creamy Greek yogurt, high in protein.',       95,  89,   80, '500 g',   2, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
  ('Eggs (Farm Fresh)',     'farm-fresh-eggs',       'White eggs from free-range farm hens.',                 75,  70,   200,'12 pcs',  2, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'),
  ('Paneer',                'paneer',                'Soft and fresh cottage cheese made from whole milk.',    85,  NULL, 100,'200 g',   2, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
  ('Cheddar Cheese',        'cheddar-cheese',        'Aged sharp cheddar cheese slice.',                     145, 135,   60,'200 g',   2, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400');

-- Products — Beverages (category_id = 3)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Orange Juice',          'orange-juice',          '100% pure squeezed orange juice, no added sugar.',      99,  89,  120,'1 L',     3, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'),
  ('Green Tea',             'green-tea',             'Premium Darjeeling green tea bags, pack of 25.',        149, 129,  80,'25 bags',  3, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400'),
  ('Sparkling Water',       'sparkling-water',       'Refreshing carbonated mineral water.',                   45,  NULL, 200,'1 L',    3, 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400'),
  ('Cold Brew Coffee',      'cold-brew-coffee',      'Smooth and strong cold brew concentrate.',              199, 179,  50,'500 ml',  3, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
  ('Coconut Water',         'coconut-water',         'Natural tender coconut water, rich in electrolytes.',    60,  55,  150,'500 ml',  3, 'https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=400');

-- Products — Snacks & Namkeen (category_id = 4)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Mixed Namkeen',         'mixed-namkeen',         'Crunchy and spicy mixed namkeen, the perfect snack.',   60,  55,  200,'400 g',   4, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
  ('Dark Chocolate Bar',    'dark-chocolate-bar',    '70% cocoa dark chocolate bar, rich and intense.',       120, 109,  100,'100 g',  4, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
  ('Roasted Almonds',       'roasted-almonds',       'Lightly salted roasted California almonds.',            299, 275,  80,'250 g',   4, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'),
  ('Rice Crackers',         'rice-crackers',         'Light and crispy Japanese-style rice crackers.',         85,  NULL, 120,'150 g',  4, 'https://images.unsplash.com/photo-1558962612-68f0d7a384e0?w=400');

-- Products — Bakery & Bread (category_id = 5)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Multigrain Bread',      'multigrain-bread',      'Freshly baked multigrain bread, whole wheat with seeds.',55, 50,   80,'400 g',   5, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400'),
  ('Croissants',            'croissants',            'Buttery flaky croissants baked to golden perfection.',  90,  NULL,  50,'4 pcs',  5, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
  ('Sourdough Loaf',        'sourdough-loaf',        'Artisan sourdough bread with a crispy crust.',          145, 129,   40,'500 g',  5, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400');

-- Products — Spices & Masala (category_id = 7)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Turmeric Powder',       'turmeric-powder',       'Pure ground turmeric with high curcumin content.',      55,  50,  100,'100 g',   7, 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400'),
  ('Red Chilli Powder',     'red-chilli-powder',     'Hot and vibrant Kashmiri red chilli powder.',           65,  NULL, 100,'100 g',  7, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'),
  ('Garam Masala',          'garam-masala',          'Authentic blend of whole ground spices.',               75,  69,   80,'100 g',   7, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'),
  ('Cumin Seeds',           'cumin-seeds',           'Aromatic jeera seeds for tempering and cooking.',       45,  NULL, 150,'100 g',  7, 'https://images.unsplash.com/photo-1612218179680-4e78b66a73d1?w=400');

-- Products — Packaged Foods (category_id = 8)
INSERT INTO products (name, slug, description, price, discount_price, stock, unit, category_id, image_url) VALUES
  ('Basmati Rice',          'basmati-rice',          'Premium aged basmati rice from the foothills of Himalayas.',130,120, 150,'1 kg', 8, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
  ('Pasta Penne',           'pasta-penne',           'Italian-style penne pasta from durum wheat semolina.',   75, 65,  120,'500 g', 8, 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400'),
  ('Rolled Oats',           'rolled-oats',           'Whole grain rolled oats for a healthy breakfast.',        85, 79,  100,'500 g', 8, 'https://images.unsplash.com/photo-1595060885968-5b7c65d97949?w=400'),
  ('Olive Oil Extra Virgin','olive-oil-extra-virgin','Cold-pressed extra virgin olive oil from Spain.',        399, 359,  60,'500 ml', 8, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400');

-- Admin User (password: Admin@1234 — bcrypt hashed)
-- Hash generated with: bcrypt.hashpw(b'Admin@1234', bcrypt.gensalt(12))
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Navix Admin', 'admin@navix.com', '$2b$12$eW5bMXHBZqCrWjVYj5V.aOb5UMrfF2cHE5L0T4FDwi3T7BqQ6bUWi', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;
