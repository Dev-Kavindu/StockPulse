import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  createdAt: string;
  createdBy: string;
}

export type NewInventoryItem = Omit<InventoryItem, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

// Initialize PostgreSQL pool if DATABASE_URL is available
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    })
  : null;

// Fallback JSON persistence for development / fallback when DATABASE_URL is not set
const DATA_FILE_NAME = "inventory.json";

async function getFilePath(): Promise<string> {
  const localDataPath = path.join(process.cwd(), "data", DATA_FILE_NAME);
  
  if (process.env.NODE_ENV === "production") {
    const tmpDataPath = path.join("/tmp", DATA_FILE_NAME);
    try {
      await fs.access(tmpDataPath);
    } catch {
      try {
        await fs.mkdir("/tmp", { recursive: true });
        await fs.access(localDataPath);
        const data = await fs.readFile(localDataPath, "utf8");
        await fs.writeFile(tmpDataPath, data, "utf8");
      } catch {
        await fs.writeFile(tmpDataPath, JSON.stringify([], null, 2), "utf8");
      }
    }
    return tmpDataPath;
  }

  return localDataPath;
}

// Helper to map DB row to InventoryItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToItem(row: any): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity: Number(row.quantity),
    price: Number(row.price),
    description: row.description || "",
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : (row.created_at || new Date().toISOString()),
    createdBy: row.created_by,
  };
}

export async function getAllItems(): Promise<InventoryItem[]> {
  if (pool) {
    try {
      const result = await pool.query("SELECT * FROM inventory_items ORDER BY created_at DESC");
      return result.rows.map(mapRowToItem);
    } catch (error) {
      console.error("Error reading inventory items from PostgreSQL:", error);
      throw error;
    }
  }

  try {
    const filePath = await getFilePath();
    let data: string;
    try {
      data = await fs.readFile(filePath, "utf8");
    } catch {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      return [];
    }

    if (!data.trim()) {
      return [];
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as InventoryItem[];
  } catch (error) {
    console.error("Error reading inventory items:", error);
    return [];
  }
}

export async function getItemById(id: string): Promise<InventoryItem | null> {
  if (pool) {
    try {
      const result = await pool.query("SELECT * FROM inventory_items WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return mapRowToItem(result.rows[0]);
    } catch (error) {
      console.error(`Error getting inventory item by id ${id} from PostgreSQL:`, error);
      throw error;
    }
  }

  try {
    const items = await getAllItems();
    const item = items.find((i) => i.id === id);
    return item || null;
  } catch (error) {
    console.error(`Error getting inventory item by id ${id}:`, error);
    return null;
  }
}

export async function addItem(itemData: NewInventoryItem): Promise<InventoryItem> {
  const id = itemData.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const createdAt = itemData.createdAt || new Date().toISOString();

  if (pool) {
    try {
      const query = `
        INSERT INTO inventory_items (id, name, category, quantity, price, description, created_at, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        id,
        itemData.name,
        itemData.category,
        itemData.quantity,
        itemData.price,
        itemData.description || "",
        createdAt,
        itemData.createdBy,
      ];
      const result = await pool.query(query, values);
      return mapRowToItem(result.rows[0]);
    } catch (error) {
      console.error("Error adding inventory item to PostgreSQL:", error);
      throw new Error(`Failed to add inventory item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    const items = await getAllItems();

    const newItem: InventoryItem = {
      ...itemData,
      id,
      createdAt,
    };

    items.push(newItem);

    const filePath = await getFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");

    return newItem;
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw new Error(`Failed to add inventory item: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteItem(id: string): Promise<boolean> {
  if (pool) {
    try {
      const result = await pool.query("DELETE FROM inventory_items WHERE id = $1", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Error deleting inventory item ${id} from PostgreSQL:`, error);
      throw new Error(`Failed to delete inventory item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    const items = await getAllItems();
    const index = items.findIndex((i) => i.id === id);
    
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);

    const filePath = await getFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");

    return true;
  } catch (error) {
    console.error(`Error deleting inventory item ${id}:`, error);
    throw new Error(`Failed to delete inventory item: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateItem(
  id: string,
  updateData: Partial<NewInventoryItem>
): Promise<InventoryItem | null> {
  // Validate quantity & price if provided
  if (updateData.quantity !== undefined && (isNaN(updateData.quantity) || updateData.quantity < 0)) {
    throw new Error("Quantity must be a non-negative number.");
  }
  if (updateData.price !== undefined && (isNaN(updateData.price) || updateData.price < 0)) {
    throw new Error("Price must be a non-negative number.");
  }

  if (pool) {
    try {
      // First get existing item to merge fields
      const existing = await getItemById(id);
      if (!existing) {
        return null;
      }

      const name = updateData.name !== undefined ? updateData.name : existing.name;
      const category = updateData.category !== undefined ? updateData.category : existing.category;
      const quantity = updateData.quantity !== undefined ? updateData.quantity : existing.quantity;
      const price = updateData.price !== undefined ? updateData.price : existing.price;
      const description = updateData.description !== undefined ? updateData.description : existing.description;
      const createdBy = updateData.createdBy !== undefined ? updateData.createdBy : existing.createdBy;

      const query = `
        UPDATE inventory_items
        SET name = $1, category = $2, quantity = $3, price = $4, description = $5, created_by = $6
        WHERE id = $7
        RETURNING *;
      `;
      const values = [name, category, quantity, price, description, createdBy, id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return mapRowToItem(result.rows[0]);
    } catch (error) {
      console.error(`Error updating inventory item ${id} in PostgreSQL:`, error);
      throw new Error(`Failed to update inventory item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    const items = await getAllItems();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return null;
    }

    const existing = items[index];

    const updatedItem: InventoryItem = {
      ...existing,
      ...updateData,
      id: existing.id, // preserve ID
      createdAt: existing.createdAt, // preserve createdAt
      createdBy: updateData.createdBy || existing.createdBy,
    };

    items[index] = updatedItem;

    const filePath = await getFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");

    return updatedItem;
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error);
    throw new Error(`Failed to update inventory item: ${error instanceof Error ? error.message : String(error)}`);
  }
}
