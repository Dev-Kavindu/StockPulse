import Link from "next/link";

export default function InventoryNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Item Not Found
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            The inventory item you are looking for does not exist or has been deleted.
          </p>
        </div>
        <div>
          <Link
            href="/inventory"
            className="inline-block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            Return to Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
