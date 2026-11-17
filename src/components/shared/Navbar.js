
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [pathname]);

  async function handleLogout() {
    try {
      setLoading(true);

      await authService.logout();

      setUser(null);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      alert(error.message || "Unable to logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="container-main flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-700">
          StudyShare
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                href="/upload"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Upload Resource
              </Link>

              <span className="hidden text-sm text-slate-500 sm:inline">
                {user.full_name || user.email}
              </span>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
