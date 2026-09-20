import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Address } from '../models/Address.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';

dotenv.config();
dotenv.config({ path: '.env.local' });

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

    console.log('[Seed Script] Seeding Categories across 7 retail domains...');
    const createdCategories = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'High-performance audio, computing devices, cameras, and accessories.',
        featured: true,
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Minimalist apparel, Italian leather footwear, and classic timepieces.',
        featured: true,
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Architectural lighting, modern furniture, and kitchen essential objects.',
        featured: true,
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-care',
        description: 'Botanical skincare, organic grooming products, and wellness kits.',
        featured: true,
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Precision training equipment, activewear, and performance gear.',
        featured: false,
      },
      {
        name: 'Books & Education',
        slug: 'books-education',
        description: 'Design theory, engineering principles, and creative literature.',
        featured: false,
      },
      {
        name: 'Everyday Essentials',
        slug: 'everyday-essentials',
        description: 'Matte carry bags, travel organizers, and workspace essentials.',
        featured: true,
      },
    ]);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    console.log('[Seed Script] Seeding Multi-Category Product Catalog...');
    const productsToInsert = [
      // 1. Electronics
      {
        name: 'OSMIUM Zero-G ANC Headphones',
        slug: 'osmium-zero-g-anc-headphones',
        sku: 'OSM-ELC-001',
        description: 'Precision active noise-canceling headphones with 40mm beryllium drivers and 36-hour battery life.',
        shortDescription: 'Wireless ANC headphones with studio sound profile.',
        price: 349,
        compareAtPrice: 399,
        category: catMap['electronics'],
        subcategory: 'Audio',
        brand: 'OSMIUM',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          color: 'Matte Obsidian',
          batteryLife: '36 hours',
          connectivity: 'Bluetooth 5.3 / 3.5mm Aux',
          noiseCancellation: 'Adaptive Hybrid ANC',
        },
      },
      {
        name: 'Quantum Mechanical Tactile Keyboard',
        slug: 'quantum-mechanical-tactile-keyboard',
        sku: 'OSM-ELC-002',
        description: 'CNC machined aluminum mechanical keyboard with hot-swappable tactile switches and per-key RGB.',
        shortDescription: 'Gasket-mounted custom mechanical keyboard.',
        price: 219,
        category: catMap['electronics'],
        subcategory: 'Computing',
        brand: 'OSMIUM',
        stock: 28,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          switchType: 'Custom Tactile',
          material: 'Anodized Aluminum',
          layout: '75%',
        },
      },

      // 2. Fashion
      {
        name: 'Minimalist Italian Leather Sneakers',
        slug: 'minimalist-italian-leather-sneakers',
        sku: 'OSM-FSH-001',
        description: 'Handcrafted full-grain Italian leather low-top sneakers with durable Margom rubber soles.',
        shortDescription: 'Clean monochromatic leather low-top sneakers.',
        price: 185,
        compareAtPrice: 220,
        category: catMap['fashion'],
        subcategory: 'Footwear',
        brand: 'OSMIUM Atelier',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          color: 'Off-White / Obsidian',
          upperMaterial: 'Full-Grain Italian Calfskin',
          sole: 'Margom Rubber',
        },
      },
      {
        name: 'Architectural Minimalist Wristwatch',
        slug: 'architectural-minimalist-wristwatch',
        sku: 'OSM-FSH-002',
        description: '38mm brushed stainless steel case with sapphire crystal glass and Swiss quartz movement.',
        shortDescription: 'Sleek monochromatic watch with mesh strap.',
        price: 240,
        category: catMap['fashion'],
        subcategory: 'Watches',
        brand: 'OSMIUM Time',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        status: 'active',
        attributes: {
          caseSize: '38mm',
          movement: 'Swiss Quartz',
          waterResistance: '50m',
        },
      },

      // 3. Home & Living
      {
        name: 'Architectural LED Desk Lamp',
        slug: 'architectural-led-desk-lamp',
        sku: 'OSM-HOM-001',
        description: 'Precision adjustable counterweighted LED desk lamp with dimmable warm spectrum control.',
        shortDescription: 'Dimmable aluminum task lighting fixture.',
        price: 129,
        category: catMap['home-living'],
        subcategory: 'Lighting',
        brand: 'OSMIUM Living',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          wattage: '12W',
          colorTemp: '2700K - 5000K Adjustable',
          finish: 'Matte Graphite',
        },
      },

      // 4. Beauty
      {
        name: 'Hydrating Botanical Facial Serum',
        slug: 'hydrating-botanical-facial-serum',
        sku: 'OSM-BTY-001',
        description: 'Nourishing hyaluronic acid serum enriched with cold-pressed botanical oils and vitamin C.',
        shortDescription: 'Daily restorative antioxidant serum.',
        price: 64,
        category: catMap['beauty-care'],
        subcategory: 'Skincare',
        brand: 'OSMIUM Botanics',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          volume: '50ml',
          skinType: 'All Skin Types',
          keyIngredients: 'Hyaluronic Acid, Niacinamide, Rosehip Oil',
        },
      },

      // 5. Sports & Fitness
      {
        name: 'Performance Insulated Water Bottle',
        slug: 'performance-insulated-water-bottle',
        sku: 'OSM-SPT-001',
        description: 'Double-wall vacuum insulated stainless steel water bottle keeping drinks cold for 24 hours.',
        shortDescription: '750ml thermal stainless steel bottle.',
        price: 45,
        category: catMap['sports-fitness'],
        subcategory: 'Accessories',
        brand: 'OSMIUM Gear',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        status: 'active',
        attributes: {
          capacity: '750ml',
          insulation: '24h Cold / 12h Hot',
          material: '18/8 Stainless Steel',
        },
      },

      // 6. Books & Education
      {
        name: 'The Creative Process & Design System',
        slug: 'the-creative-process-and-design-system',
        sku: 'OSM-BOK-001',
        description: 'Hardcover architectural monograph exploring modern design systems, human interface design, and typography.',
        shortDescription: 'Hardcover design theory book.',
        price: 32,
        category: catMap['books-education'],
        subcategory: 'Design',
        brand: 'OSMIUM Press',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        status: 'active',
        attributes: {
          pages: '320 pages',
          format: 'Hardcover',
          isbn: '978-0-123456-78-9',
        },
      },

      // 7. Everyday Essentials
      {
        name: 'Precision Matte Travel Backpack',
        slug: 'precision-matte-travel-backpack',
        sku: 'OSM-ESS-001',
        description: 'Weatherproof 22L laptop backpack crafted from recycled ballistic nylon with hidden passport pocket.',
        shortDescription: '22L weatherproof commuter backpack.',
        price: 149,
        compareAtPrice: 179,
        category: catMap['everyday-essentials'],
        subcategory: 'Travel',
        brand: 'OSMIUM Carry',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        status: 'active',
        attributes: {
          capacity: '22 Liters',
          laptopCompartment: 'Up to 16 inch',
          waterproofRating: 'IPX4 Weatherproof',
        },
      },
    ];

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
