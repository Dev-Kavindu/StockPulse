'use client';

import { useActionState, useState } from "react";
import { addItemAction, ActionState } from "./actions";
import Link from "next/link";

interface InventoryClientProps {
  items: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    description: string;
    createdAt: string;
    createdBy: string;
  }[];
  userRole: "admin" | "user";
  onDelete: (id: string) => Promise<void>;
}

export default function InventoryClient({ items, userRole, onDelete }: InventoryClientProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addItemAction,
    null
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await onDelete(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {deleteError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {deleteError}
        </div>
      )}

      {/* Items Table / Cards */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Inventory Items ({filteredItems.length})
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Role: <span className="font-medium uppercase">{userRole}</span>
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
            No inventory items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Added By</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-zinc-900 dark:text-zinc-100">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${
                          item.quantity <= 5
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-900 dark:text-zinc-100">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
                      {item.createdBy}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                      >
                        View
                      </Link>
                      {userRole === "admin" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-red-600 dark:text-red-400 hover:underline text-xs font-medium disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Item Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Add New Item
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the details below to add a new item to the inventory.
          </p>
        </div>

        {state?.message && (
          <div
            className={`p-4 rounded-lg text-sm border ${
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
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ergonomic Office Chair"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {state?.errors?.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {state.errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                required
                placeholder="e.g. Furniture"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {state?.errors?.category && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {state.errors.category}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {state?.errors?.quantity && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {state.errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {state?.errors?.price && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {state.errors.price}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Provide a brief description of the item..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {state?.errors?.description && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {state.errors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-sm shadow-blue-500/20 disabled:opacity-50 active:scale-95"
            >
              {isPending ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
