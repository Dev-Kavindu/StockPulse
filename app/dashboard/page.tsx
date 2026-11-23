import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllItems } from "@/lib/inventory";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const items = await getAllItems();

  const totalItems = items.length;
  const totalStockQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
  const lowStockCount = items.filter((item) => (Number(item.quantity) || 0) < 10).length;

  const sortedItems = [...items].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  const recentItems = sortedItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-all duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                session.role === "admin" 
                  ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  : "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              }`}>
                {session.role}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back, <span className="font-semibold text-zinc-800 dark:text-zinc-200">{session.name}</span>.
            </p>
          </div>
          <Link
            href="/inventory"
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            Manage Inventory
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Items", value: totalItems, sub: "Unique SKUs", color: "blue" },
            { label: "Total Stock", value: totalStockQuantity.toLocaleString(), sub: "Physical units", color: "indigo" },
            { label: "Total Value", value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, sub: "Estimated valuation", color: "emerald" },
            { label: "Low Stock (< 10)", value: lowStockCount, sub: "Items to reorder", color: "rose", highlight: lowStockCount > 0 },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 dark:shadow-none space-y-2 transition-all duration-200 hover:shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{stat.label}</span>
              <div className={`text-3xl font-extrabold ${stat.highlight ? "text-rose-600 dark:text-rose-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {stat.value}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm shadow-zinc-200/50 dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recently Added Items</h2>
            <Link href="/inventory" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">View All →</Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="p-12 text-center text-sm text-zinc-500 dark:text-zinc-400">No items available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Quantity</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {recentItems.map((item) => {
                    const isLow = item.quantity < 10;
                    return (
                      <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200">
                        <td className="py-4 px-6 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">{item.category}</td>
                        <td className="py-4 px-6">
                          <span className={`font-semibold flex items-center gap-2 ${isLow ? "text-rose-600 dark:text-rose-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                            {item.quantity}
                            {isLow && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 uppercase">Low</span>}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">${Number(item.price).toFixed(2)}</td>
                        <td className="py-4 px-6 text-right">
                          <Link href={`/inventory/${item.id}`} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all duration-200">View</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}