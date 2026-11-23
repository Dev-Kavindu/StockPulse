'use client';

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

interface MobileNavProps {
  session: {
    name: string;
    role: "admin" | "user";
    email?: string;
  } | null;
}

export function MobileNav({ session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xl p-4 flex flex-col gap-3 z-50 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Home
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/inventory"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Inventory
              </Link>
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-between border border-zinc-200/80 dark:border-zinc-700/80">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {session.name}
                  </span>
                  {session.email && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {session.email}
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    session.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  }`}
                >
                  {session.role}
                </span>
              </div>
              <form action={logoutAction} className="w-full pt-1">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-center"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors text-center shadow-md shadow-blue-500/20"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
