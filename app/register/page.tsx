"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 transition-all duration-200">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none p-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Create an Account</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Join us to start managing your inventory</p>
        </div>

        {state?.error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-400 text-sm flex items-start gap-3 transition-all duration-200">
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Registration Failed</span>
              {state.error}
            </div>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Name</label>
            <input type="text" name="name" required className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email</label>
            <input type="email" name="email" required className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white text-sm" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 text-sm"
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
