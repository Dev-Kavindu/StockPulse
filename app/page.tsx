import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getSession();
  const ctaHref = session ? "/dashboard" : "/login";

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Next-Gen Inventory Control
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1]">
            Master Your Stock with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StockPulse
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
            Streamline warehouse operations, monitor live stock counts, prevent stockouts with intelligent alerts, and manage role-based team permissions in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={ctaHref}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 text-base flex items-center justify-center gap-2"
            >
              <span>{session ? "Go to Dashboard" : "Get Started Now"}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/inventory"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold shadow-sm transition-all duration-200 text-base flex items-center justify-center gap-2"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Powerful Features
          </h2>
          <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Everything you need to keep inventory flowing
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Designed for speed, security, and absolute reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Live Stock Analytics
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Track total inventory items, aggregate stock quantities, valuation metrics, and low-stock indicators instantly from your dashboard.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Role-Based Access Control
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Secure administrative controls for adding and deleting items, paired with standard user viewing permissions for secure enterprise operations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Lightning Fast Search & Filter
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Filter items across multiple categories, search by SKU or product name, and manage deep catalog metadata with zero friction.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to optimize your inventory workflow?
          </h3>
          <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
            Log in with demo admin or user credentials to test full capabilities instantly.
          </p>
          <div className="pt-2">
            <Link
              href={ctaHref}
              className="inline-flex px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold transition-all duration-200 shadow-md text-sm sm:text-base transform hover:-translate-y-0.5"
            >
              {session ? "Access Dashboard" : "Sign In to StockPulse"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
