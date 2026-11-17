
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function ForbiddenPage() {
  return (
    <>
      <Navbar />

      <main className="container-main flex min-h-[70vh] items-center justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-red-600">
            403
          </h1>

          <h2 className="mb-3 text-xl font-semibold">
            Forbidden
          </h2>

          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            You cannot modify or delete this resource because
            you are not its owner.
          </p>

          <Link
            href="/"
            className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
