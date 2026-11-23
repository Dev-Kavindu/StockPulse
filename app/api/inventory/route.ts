import { getAllItems, getItemById, addItem, deleteItem } from "@/lib/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const item = await getItemById(id);
    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    return Response.json(item);
  }

  const items = await getAllItems();
  return Response.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || typeof body.quantity !== "number" || typeof body.price !== "number") {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await addItem({
      name: body.name,
      category: body.category,
      quantity: body.quantity,
      price: body.price,
      description: body.description || "",
      createdBy: body.createdBy || "system",
    });

    return Response.json(newItem, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing item id" }, { status: 400 });
    }

    const success = await deleteItem(id);
    if (!success) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
