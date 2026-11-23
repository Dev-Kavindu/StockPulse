'use server';

import { getSession } from "@/lib/auth";
import { addItem, deleteItem } from "@/lib/inventory";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string;
    category?: string;
    description?: string;
    quantity?: string;
    price?: string;
  };
} | null;

export async function addItemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to add an item.",
    };
  }

  const name = formData.get("name")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const quantityStr = formData.get("quantity")?.toString().trim() || "";
  const priceStr = formData.get("price")?.toString().trim() || "";

  const errors: NonNullable<ActionState>["errors"] = {};

  if (!name) {
    errors.name = "Name is required.";
  }
  if (!category) {
    errors.category = "Category is required.";
  }
  if (!description) {
    errors.description = "Description is required.";
  }

  const quantity = Number(quantityStr);
  if (quantityStr === "" || isNaN(quantity) || quantity < 0) {
    errors.quantity = "Quantity must be a non-negative number.";
  }

  const price = Number(priceStr);
  if (priceStr === "" || isNaN(price) || price < 0) {
    errors.price = "Price must be a non-negative number.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors,
    };
  }

  try {
    await addItem({
      name,
      category,
      description,
      quantity,
      price,
      createdBy: session.email,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Item added successfully!",
    };
  } catch (error) {
    console.error("addItemAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add item.",
    };
  }
}

export async function deleteItemAction(id: string): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      message: "Unauthorized: You must be logged in.",
    };
  }

  if (session.role !== "admin") {
    return {
      success: false,
      message: "Forbidden: Only administrators can delete items.",
    };
  }

  try {
    const deleted = await deleteItem(id);
    if (!deleted) {
      return {
        success: false,
        message: "Item not found.",
      };
    }

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Item deleted successfully.",
    };
  } catch (error) {
    console.error("deleteItemAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete item.",
    };
  }
}
