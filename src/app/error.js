
"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="mb-3 text-2xl font-bold text-red-600">
          Something went wrong
        </h1>

        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          {error?.message || "An unexpected error occurred."}
        </p>

        <button
          onClick={() => reset()}
          className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
