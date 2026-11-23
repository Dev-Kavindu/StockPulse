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
        // Check if local data file exists to copy from
        await fs.access(localDataPath);
        const data = await fs.readFile(localDataPath, "utf8");
        await fs.writeFile(tmpDataPath, data, "utf8");
      } catch {
        // If local file doesn't exist either, initialize with empty array
        await fs.writeFile(tmpDataPath, JSON.stringify([], null, 2), "utf8");
      }
    }
    return tmpDataPath;
  }

  return localDataPath;
}

export async function getAllItems(): Promise<InventoryItem[]> {
  try {
    const filePath = await getFilePath();
    let data: string;
    try {
      data = await fs.readFile(filePath, "utf8");
    } catch {
      // If file doesn't exist, try returning empty array and ensuring directory
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
  try {
    const items = await getAllItems();
    
    // Generate unique ID if not provided
    const id = itemData.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const createdAt = itemData.createdAt || new Date().toISOString();

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
