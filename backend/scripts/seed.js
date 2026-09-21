import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.ts';
import { Category } from '../models/Category.ts';
import { Product } from '../models/Product.ts';
import { Address } from '../models/Address.ts';
import { Review } from '../models/Review.ts';
import { Order } from '../models/Order.ts';

dotenv.config();
dotenv.config({ path: '.env.local' });

// Curated high quality Unsplash photo collections by category
const categoryImages = {
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248597400-f9479b1b7f0e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  ],
  'home-living': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  ],
  'beauty-care': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248597400-f9479b1b7f0e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  ],
  'sports-fitness': [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  ],
  'books-education': [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  ],
  'everyday-essentials': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  ],
};

const categoryConfigs = [
  {
    slug: 'electronics',
    name: 'Electronics',
    prefix: 'ELC',
    brand: 'OSMIUM Tech',
    targetCount: 35,
    subcategories: ['Audio', 'Computing', 'Wearables', 'Smart Home', 'Cameras', 'Accessories'],
    adjectives: ['Zero-G', 'Quantum', 'Apex', 'Obsidian', 'Beryllium', 'Monolithic', 'Hyperion', 'Acoustic', 'Tactile', 'Precision', 'Vector', 'Sonic', 'Pro', 'Studio', 'Ultra'],
    nouns: ['Headphones', 'Earbuds', 'Mechanical Keyboard', 'Studio Monitor', 'OLED Display', 'Wireless Charger', 'DAC Amplifier', 'Webcam', 'Smart Watch', 'Power Bank', 'Microphone', 'Graphics Tablet', 'Audio Interface', 'Desk Hub', 'Trackpad'],
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    prefix: 'FSH',
    brand: 'OSMIUM Atelier',
    targetCount: 35,
    subcategories: ['Footwear', 'Outerwear', 'Watches', 'Apparel', 'Accessories'],
    adjectives: ['Minimalist', 'Italian Leather', 'Architectural', 'Monochromatic', 'Merino Wool', 'Tailored', 'Obsidian', 'Cashmere', 'Raw Denim', 'Waterproof', 'Structured', 'Classic', 'Sleek'],
    nouns: ['Sneakers', 'Chelsea Boots', 'Wristwatch', 'Overcoat', 'Trench Coat', 'Cardigan', 'Sunglasses', 'Leather Belt', 'Weekender Bag', 'Oxford Shirt', 'T-Shirt', 'Blazer', 'Trousers', 'Scarf'],
  },
  {
    slug: 'home-living',
    name: 'Home & Living',
    prefix: 'HOM',
    brand: 'OSMIUM Living',
    targetCount: 30,
    subcategories: ['Lighting', 'Furniture', 'Kitchenware', 'Decor', 'Utilities'],
    adjectives: ['Architectural', 'Dimmable', 'Cast Aluminum', 'Ceramic', 'Walnut', 'Matte Black', 'Modular', 'Ergonomic', 'Minimalist', 'Smokey Glass', 'Concrete', 'Monolith'],
    nouns: ['LED Desk Lamp', 'Pendant Light', 'Lounge Chair', 'Side Table', 'Pour-Over Kettle', 'Espresso Mug Set', 'Aromatherapy Diffuser', 'Wall Clock', 'Organizing Tray', 'Vase', 'Planter', 'Bookshelf'],
  },
  {
    slug: 'beauty-care',
    name: 'Beauty & Personal Care',
    prefix: 'BTY',
    brand: 'OSMIUM Botanics',
    targetCount: 25,
    subcategories: ['Skincare', 'Haircare', 'Grooming', 'Wellness'],
    adjectives: ['Botanical', 'Hydrating', 'Restorative', 'Organic', 'Nourishing', 'Antioxidant', 'Gentle', 'Revitalizing', 'Pure', 'Cold-Pressed', 'Calming'],
    nouns: ['Facial Serum', 'Cleansing Oil', 'Night Balm', 'Shampoo', 'Conditioner', 'Beard Butter', 'Body Wash', 'Exfoliating Scrub', 'Hydrating Mist', 'Sunscreen SPF 50', 'Eye Concentrate'],
  },
  {
    slug: 'sports-fitness',
    name: 'Sports & Fitness',
    prefix: 'SPT',
    brand: 'OSMIUM Performance',
    targetCount: 25,
    subcategories: ['Gear', 'Apparel', 'Accessories', 'Recovery'],
    adjectives: ['Performance', 'Insulated', 'Carbon Fiber', 'Breathable', 'Ergonomic', 'Heavy-Duty', 'Lightweight', 'High-Density', 'Compression', 'Precision'],
    nouns: ['Water Bottle', 'Yoga Mat', 'Resistance Band Set', 'Kettlebell', 'Running Shorts', 'Gym Duffel Bag', 'Foam Roller', 'Smart Jump Rope', 'Training Gloves', 'Massage Gun'],
  },
  {
    slug: 'books-education',
    name: 'Books & Education',
    prefix: 'BOK',
    brand: 'OSMIUM Press',
    targetCount: 25,
    subcategories: ['Design', 'Technology', 'Architecture', 'Theory'],
    adjectives: ['The Creative', 'Systems &', 'Monolith:', 'Mastering', 'Foundations of', 'The Art of', 'Modern', 'Essential', 'Future of', 'Principles of'],
    nouns: ['Design System Monograph', 'Software Architecture Guide', 'Typography & Grid Systems', 'Human Interface Field Manual', 'Algorithmic Thinking', 'Minimalist Product Design', 'Code Quality Patterns', 'Product Strategy Notebook'],
  },
  {
    slug: 'everyday-essentials',
    name: 'Everyday Essentials',
    prefix: 'ESS',
    brand: 'OSMIUM Carry',
    targetCount: 25,
    subcategories: ['Travel', 'Workspace', 'Organizers', 'Bags'],
    adjectives: ['Precision Matte', 'Weatherproof', 'Ballistic Nylon', 'Modular', 'Tactile', 'Compact', 'Ergonomic', 'Obsidian', 'Magnetic'],
    nouns: ['Travel Backpack', 'Tech Organizer Pouch', 'Desk Mat', 'Key Carabiner', 'Passport Folio', 'Cardholder Wallet', 'Waterproof Sling Bag', 'Laptop Sleeve', 'Cable Management Kit'],
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/osmium';
    console.log(`[Seed Script] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed Script] Purging existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Address.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log('[Seed Script] Seeding Admin and Customer accounts...');
    const adminUser = await User.create({
      name: 'Osmium Admin',
      email: 'admin@osmium.com',
      password: 'AdminPassword123!',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Enoch Abolude',
      email: 'customer@osmium.com',
      password: 'CustomerPassword123!',
      role: 'customer',
    });

    console.log('[Seed Script] Seeding 7 Retail Categories...');
    const categoriesToInsert = categoryConfigs.map((cfg) => ({
      name: cfg.name,
      slug: cfg.slug,
      description: `Curated high-performance ${cfg.name.toLowerCase()} for modern lifestyle.`,
      featured: true,
    }));

    const createdCategories = await Category.insertMany(categoriesToInsert);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    console.log('[Seed Script] Generating 200 Products across categories...');
    const productsToInsert = [];

    categoryConfigs.forEach((cfg) => {
      const categoryId = catMap[cfg.slug];
      const images = categoryImages[cfg.slug] || categoryImages.electronics;

      for (let i = 1; i <= cfg.targetCount; i++) {
        const adj = cfg.adjectives[(i - 1) % cfg.adjectives.length];
        const noun = cfg.nouns[(i - 1) % cfg.nouns.length];
        const subcat = cfg.subcategories[(i - 1) % cfg.subcategories.length];

        const skuNum = String(i).padStart(3, '0');
        const sku = `OSM-${cfg.prefix}-${skuNum}`;
        const name = i === 1 ? `OSMIUM ${adj} ${noun}` : `${adj} ${noun} ${i > cfg.nouns.length ? `(Gen ${Math.floor(i / cfg.nouns.length) + 1})` : ''}`.trim();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Base pricing calculations per category domain
        let basePrice = 45;
        if (cfg.slug === 'electronics') basePrice = 85 + (i * 12);
        else if (cfg.slug === 'fashion') basePrice = 65 + (i * 8);
        else if (cfg.slug === 'home-living') basePrice = 50 + (i * 9);
        else if (cfg.slug === 'beauty-care') basePrice = 25 + (i * 4);
        else if (cfg.slug === 'sports-fitness') basePrice = 30 + (i * 5);
        else if (cfg.slug === 'books-education') basePrice = 22 + (i * 2);
        else if (cfg.slug === 'everyday-essentials') basePrice = 40 + (i * 6);

        const price = Math.round(basePrice);
        const hasCompare = i % 3 === 0;
        const compareAtPrice = hasCompare ? Math.round(price * 1.25) : null;
        const imgUrl = images[(i - 1) % images.length];

        productsToInsert.push({
          name,
          slug,
          sku,
          description: `High-precision ${name.toLowerCase()} engineered with premium materials, minimalist aesthetics, and functional design built to last.`,
          shortDescription: `Curated ${subcat.toLowerCase()} essential by ${cfg.brand}.`,
          price,
          compareAtPrice,
          category: categoryId,
          subcategory: subcat,
          brand: cfg.brand,
          stock: 15 + ((i * 7) % 85),
          images: [imgUrl],
          featured: i % 7 === 0 || i === 1,
          status: 'active',
          attributes: {
            subcategory: subcat,
            material: 'Premium Grade',
            finish: 'Matte Obsidian',
          },
        });
      }
    });

    const createdProducts = await Product.insertMany(productsToInsert);

    console.log('[Seed Script] Seeding Default Address and Review...');
    await Address.create({
      user: customerUser._id,
      fullName: 'Enoch Abolude',
      street: '100 Innovation Way',
      apartment: 'Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      phone: '+1 (555) 019-2834',
      isDefault: true,
    });

    await Review.create({
      user: customerUser._id,
      product: createdProducts[0]._id,
      rating: 5,
      title: 'Flawless acoustic clarity and build quality',
      comment: 'The noise cancellation is remarkably precise and the materials feel incredibly premium.',
      isVerifiedPurchase: true,
    });

    console.log('✅ [Seed Script] Database successfully populated!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:    admin@osmium.com / AdminPassword123!');
    console.log('Customer Account: customer@osmium.com / CustomerPassword123!');
    console.log(`Categories:       ${createdCategories.length}`);
    console.log(`Products:         ${createdProducts.length}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Script Error]:', error);
    process.exit(1);
  }
};

seedData();
