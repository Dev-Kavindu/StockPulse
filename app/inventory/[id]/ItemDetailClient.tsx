'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { updateItemAction, ActionState } from "../actions";
import Link from "next/link";
import { ArrowLeft, Trash2, AlertTriangle, Package, DollarSign, Tag, Clock, User, Pencil } from "lucide-react";

interface ItemDetailClientProps {
  item: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    description: string;
    createdAt: string;
    createdBy: string;
  };
  userRole: "admin" | "user";
  onDelete: (id: string) => Promise<void>;
}

export default function ItemDetailClient({
  item,
  userRole,
  onDelete,
}: ItemDetailClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateItemAction.bind(null, item.id),
    null
  );

  const isLowStock = item.quantity < 10;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(item.id);
      router.push("/inventory");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Link>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mb-3">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {item.name}
              </h1>
            </div>
            <div className="text-right flex items-center gap-4">
              {userRole === "admin" && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Price</p>
                <div className="flex items-center text-2xl font-bold text-zinc-900 dark:text-white">
                  <DollarSign className="w-5 h-5 text-zinc-400" />
                  {item.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="p-6">
              {state?.message && (
                <div
                  className={`mb-6 p-4 rounded-lg text-sm border ${
                    state.success
                      ? "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {state.message}
                </div>
              )}
              <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                    <input name="name" defaultValue={item.name} className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                    <input name="category" defaultValue={item.category} className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Quantity</label>
                    <input type="number" name="quantity" defaultValue={item.quantity} className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Price</label>
                    <input type="number" step="0.01" name="price" defaultValue={item.price} className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                  <textarea name="description" defaultValue={item.description} rows={3} className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300">Cancel</button>
                  <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${isLowStock ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800'}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    <Package className="w-4 h-4" />
                    Quantity in Stock
                  </div>
                  <div className={`text-2xl font-bold ${isLowStock ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}>
                    {item.quantity} units
                    {isLowStock && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    <Clock className="w-4 h-4" />
                    Added
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-200 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                    <User className="w-3 h-3" />
                    {item.createdBy}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Description
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {item.description || "No description provided."}
                </p>
              </div>

              {userRole === "admin" && (
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-sm shadow-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Deleting..." : "Delete Item"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}