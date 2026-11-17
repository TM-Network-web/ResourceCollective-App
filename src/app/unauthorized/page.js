
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function UnauthorizedPage() {
  return (
    <>
      <Navbar />

      <main className="container-main flex min-h-[70vh] items-center justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            You don't have permission to access this page.
            Please log in with an authorized student account.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
