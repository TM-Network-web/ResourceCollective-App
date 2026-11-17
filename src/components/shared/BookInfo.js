
"use client";

import { useState } from "react";
import { bookService } from "@/services/book.service";

export default function BookInfo({ onSelect }) {
  const [isbn, setIsbn] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup(event) {
    event.preventDefault();

    if (!isbn.trim()) {
      setError("Please enter an ISBN number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBook(null);

      const result = await bookService.lookup(isbn.trim());

      setBook(result);

      if (onSelect) {
        onSelect({ ...result, isbn: isbn.trim() });
      }
    } catch (err) {
      setError(err.message || "Book not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="mb-2 font-semibold">Find Book Details</h3>

      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        Enter an ISBN to retrieve book information.
      </p>

      <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={isbn}
          onChange={(event) => setIsbn(event.target.value)}
          placeholder="Enter ISBN"
          className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Searching..." : "Find Book"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {book && (
        <div className="mt-5 flex gap-4">
          {book.thumbnail && (
            <img
              src={book.thumbnail}
              alt={book.title || "Book cover"}
              className="h-32 w-24 rounded object-cover"
            />
          )}

          <div className="text-sm">
            <h4 className="font-bold">{book.title}</h4>
            {book.authors && <p className="mt-1">Author: {book.authors}</p>}
            {book.publisher && <p>Publisher: {book.publisher}</p>}
            {book.published_date && <p>Published: {book.published_date}</p>}
            {book.description && (
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {book.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
