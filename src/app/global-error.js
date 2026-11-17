
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <h1 className="mb-3 text-2xl font-bold text-red-600">
              Application Error
            </h1>

            <p className="mb-6 text-sm text-slate-600">
              {error?.message || "An unexpected error occurred."}
            </p>

            <button
              onClick={() => reset()}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
