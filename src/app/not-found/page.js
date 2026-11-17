
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="mb-3 text-5xl font-bold text-[var(--color-primary)]">
          404
        </h1>

        <h2 className="mb-2 text-xl font-semibold">
          Page Not Found
        </h2>

        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
