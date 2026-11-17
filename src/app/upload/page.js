
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookInfo from "@/components/shared/BookInfo";
import { resourceService } from "@/services/resource.service";

export default function UploadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    isbn: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleBookSelect(book) {
    setForm((previous) => ({
      ...previous,
      title: book.title || previous.title,
      isbn: book.isbn || previous.isbn,
      description: book.description || previous.description,
    }));
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must not exceed 10 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    if (!form.title.trim() || !form.subject.trim()) {
      setError("Title and subject are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("subject", form.subject.trim());
    formData.append("description", form.description.trim());
    formData.append("isbn", form.isbn.trim());
    formData.append("file", file);

    try {
      setLoading(true);

      const createdResource = await resourceService.upload(formData);

      if (createdResource?.id) {
        router.replace(`/resources/${createdResource.id}`);
      } else {
        router.replace("/");
      }

      router.refresh();
    } catch (err) {
      setError(err.message || "Resource upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="container-main py-10">
          <div className="card mx-auto max-w-2xl p-6 md:p-8">
            <h1 className="mb-2 text-2xl font-bold text-slate-900">
              Upload Study Resource
            </h1>

            <p className="mb-6 text-sm text-slate-500">
              Share your notes, books, and study materials with other students.
            </p>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-6">
              <BookInfo
                isbn={form.isbn}
                onSelect={handleBookSelect}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resource Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter resource title"
                  required
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={form.isbn}
                  onChange={handleChange}
                  placeholder="Enter book ISBN (optional)"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this study resource..."
                  rows={4}
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  PDF File * (Maximum 10 MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3"
                />

                {file && (
                  <p className="mt-2 text-sm text-green-700">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Resource"}
              </button>
            </form>
          </div>
        </main>
      </>
    </ProtectedRoute>
  );
}
