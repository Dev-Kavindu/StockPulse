import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Load .env.local manually if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error("Error loading .env.local:", err);
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not set in environment or .env.local");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

const dummyItems = [
  {
    id: "item-seed-001",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    quantity: 45,
    price: 189.99,
    description: "Adjustable height ergonomic office chair with lumbar support and breathable mesh back.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-002",
    name: "Wireless Mechanical Keyboard",
    category: "Electronics",
    quantity: 8, // Low stock (< 10)
    price: 89.50,
    description: "RGB backlit mechanical keyboard with hot-swappable switches and dual connectivity.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-003",
    name: "UltraWide 34-inch Monitor",
    category: "Electronics",
    quantity: 12,
    price: 499.00,
    description: "WQHD curved IPS monitor with USB-C power delivery and HDR400 support.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-004",
    name: "Standing Desk Converter",
    category: "Furniture",
    quantity: 5, // Low stock (< 10)
    price: 149.99,
    description: "Quick-sit tabletop workstation with spacious keyboard tray and gas spring riser.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-005",
    name: "Noise-Cancelling Wireless Headphones",
    category: "Electronics",
    quantity: 30,
    price: 249.00,
    description: "Over-ear Bluetooth headphones with active noise cancellation and 40-hour battery life.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-006",
    name: "Stainless Steel Water Bottle",
    category: "Accessories",
    quantity: 120,
    price: 24.99,
    description: "Double-walled vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-007",
    name: "USB-C Multi-Port Hub",
    category: "Electronics",
    quantity: 4, // Low stock (< 10)
    price: 45.99,
    description: "7-in-1 adapter featuring 4K HDMI, 3x USB 3.0 ports, SD card reader, and 100W PD charging.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-008",
    name: "Executive Leather Notebook",
    category: "Stationery",
    quantity: 75,
    price: 18.50,
    description: "A5 hardcover journal with premium thick ruled paper, pen loop, and inner pocket.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-009",
    name: "LED Desk Lamp with Wireless Charger",
    category: "Lighting",
    quantity: 60,
    price: 39.99,
    description: "Dimmable eye-caring desk light with adjustable color temperatures and base charging pad.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-010",
    name: "Executive Mesh Guest Chair",
    category: "Furniture",
    quantity: 3, // Low stock (< 10)
    price: 125.00,
    description: "Sturdy visitor chair with breathable mesh and sleek chrome cantilever base.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-011",
    name: "Precision Wireless Mouse",
    category: "Electronics",
    quantity: 85,
    price: 49.99,
    description: "Ergonomic laser mouse with customizable side buttons and fast scrolling wheel.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-012",
    name: "Adjustable Laptop Stand",
    category: "Accessories",
    quantity: 50,
    price: 29.99,
    description: "Foldable aluminum notebook riser compatible with all 10-17 inch laptops.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-013",
    name: "Minimalist Wooden Bookshelf",
    category: "Furniture",
    quantity: 15,
    price: 179.00,
    description: "5-tier rustic industrial bookcase with sturdy metal frame and oak finish shelves.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-014",
    name: "Gel Memory Foam Seat Cushion",
    category: "Accessories",
    quantity: 7, // Low stock (< 10)
    price: 34.50,
    description: "Orthopedic coccyx cushion for office chair and car seat pain relief.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-015",
    name: "External SSD 1TB NVMe",
    category: "Electronics",
    quantity: 40,
    price: 109.99,
    description: "Portable solid state drive with up to 1050MB/s read speeds and shock-resistant design.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-016",
    name: "Premium Gel Pen Set (12-Pack)",
    category: "Stationery",
    quantity: 95,
    price: 14.99,
    description: "Smooth writing black ink pens with comfortable grip and quick-drying smear-proof ink.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-017",
    name: "Smart Wi-Fi Power Strip",
    category: "Electronics",
    quantity: 6, // Low stock (< 10)
    price: 32.99,
    description: "Surge protector with 4 individual smart outlets and 4 USB charging ports compatible with Alexa.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-018",
    name: "Filing Cabinet 3-Drawer",
    category: "Furniture",
    quantity: 10,
    price: 159.00,
    description: "Lockable metal rolling office file cabinet with hanging folder drawer and casters.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-019",
    name: "Microfiber Cleaning Cloths (24-Pack)",
    category: "Accessories",
    quantity: 150,
    price: 12.99,
    description: "Lint-free and scratch-free cleaning cloths for screens, camera lenses, and delicate surfaces.",
    createdBy: "admin@inventory.com"
  },
  {
    id: "item-seed-020",
    name: "Heavy Duty Shredder",
    category: "Office Supplies",
    quantity: 2, // Low stock (< 10)
    price: 119.99,
    description: "Cross-cut paper shredder with continuous run time and credit card shredding capability.",
    createdBy: "admin@inventory.com"
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connected to PostgreSQL database.");

    // Ensure table exists by reading schema.sql if needed, or rely on schema.sql already applied
    const schemaPath = path.join(process.cwd(), "db", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      console.log("Applying schema to ensure tables exist...");
      await client.query(schemaSql);
    }

    console.log(`Starting seeding process for ${dummyItems.length} inventory items...`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of dummyItems) {
      // Check if item with this id or name already exists to prevent duplicates
      const checkRes = await client.query(
        "SELECT id FROM inventory_items WHERE id = $1 OR name = $2",
        [item.id, item.name]
      );

      if (checkRes.rows.length > 0) {
        console.log(`Item already exists (id: ${item.id}, name: ${item.name}). Skipping.`);
        skippedCount++;
      } else {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, quantity, price, description, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            item.id,
            item.name,
            item.category,
            item.quantity,
            item.price,
            item.description,
            item.createdBy,
          ]
        );
        console.log(`Inserted: [${item.category}] ${item.name} (Qty: ${item.quantity}, Price: $${item.price})`);
        insertedCount++;
      }
    }

    console.log(`\nSeeding complete! Inserted: ${insertedCount}, Skipped (already existed): ${skippedCount}`);

    // Verify total count in table
    const countRes = await client.query("SELECT COUNT(*) as total, COUNT(CASE WHEN quantity < 10 THEN 1 END) as low_stock FROM inventory_items");
    console.log(`Database summary -> Total inventory items: ${countRes.rows[0].total}, Low stock items (<10): ${countRes.rows[0].low_stock}`);

  } catch (error) {
    console.error("Error running seed script:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
