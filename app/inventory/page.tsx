import { getSession } from "@/lib/auth";
import { getAllItems } from "@/lib/inventory";
import { redirect } from "next/navigation";
import { deleteItemAction } from "./actions";
import InventoryClient from "./InventoryClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function InventoryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const items = await getAllItems();

  async function onDelete(id: string) {
    "use server";
    const res = await deleteItemAction(id);
    if (!res.success) {
      throw new Error(res.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Inventory
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your store's stock, categories, and inventory items.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-200">
          <InventoryClient
            items={items}
            userRole={session.role}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
