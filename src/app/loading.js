
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Loading StudyShare...
        </p>
      </div>
    </main>
  );
}
