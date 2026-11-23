import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { MobileNav } from "./MobileNav";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-all duration-200 transform group-hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            StockPulse
          </span>
        </Link>

        {/* Desktop Navigation Links & User Info */}
        <nav className="hidden md:flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          >
            Home
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Dashboard
              </Link>
              <Link
                href="/inventory"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Inventory
              </Link>

              <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {session.name}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    session.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 shadow-sm"
                      : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-sm"
                  }`}
                >
                  {session.role}
                </span>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-sm font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 shadow-sm active:scale-95"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20 transform hover:-translate-y-0.5"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Navigation */}
        <MobileNav session={session} />
      </div>
    </header>
  );
}
