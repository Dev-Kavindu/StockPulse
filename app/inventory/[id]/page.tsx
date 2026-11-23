import { getSession } from "@/lib/auth";
import { getItemById } from "@/lib/inventory";
import { redirect, notFound } from "next/navigation";
import { deleteItemAction } from "../actions";
import ItemDetailClient from "./ItemDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  async function onDelete(itemId: string) {
    "use server";
    const res = await deleteItemAction(itemId);
    if (!res.success) {
      throw new Error(res.message);
    }
  }

  return (
    <ItemDetailClient
      item={item}
      userRole={session.role}
      onDelete={onDelete}
    />
  );
}
