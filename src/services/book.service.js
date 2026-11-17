
import { apiRequest } from "@/lib/api-client";

export const bookService = {
  lookup(isbn) {
    const cleanIsbn = String(isbn || "").replace(/[-\s]/g, "");

    if (!cleanIsbn) {
      throw new Error("Please enter an ISBN.");
    }

    return apiRequest(`/api/books/${encodeURIComponent(cleanIsbn)}`);
  },
};
