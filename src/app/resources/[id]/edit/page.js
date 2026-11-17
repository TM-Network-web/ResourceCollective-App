
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { resourceService } from "@/services/resource.service";

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    isbn: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadResource = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const resource = await resourceService.getById(id);

      setForm({
        title: resource.title || "",
        subject: resource.subject || "",
        description: resource.description || "",
        isbn: resource.isbn || "",
      });
    } catch (err) {
      setError(err.message || "Unable to load resource.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadResource();
  }, [loadResource]);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.subject.trim()) {
      setError("Title and subject are required.");
      return;
    }

    try {
      setSaving(true);

      await resourceService.update(id, {
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        isbn: form.isbn.trim(),
      });

      router.replace(`/resources/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to update resource.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="container-main py-10">
          <div className="card mx-auto max-w-2xl p-6 md:p-8">
            <Link
              href={`/resources/${id}`}
              className="mb-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to resource
            </Link>

            <h1 className="mb-2 text-2xl font-bold text-slate-900">
              Edit Resource
            </h1>

            <p className="mb-6 text-sm text-slate-500">
              Update the information for your study resource.
            </p>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
                {!loading && (
                  <button
                    type="button"
                    onClick={loadResource}
                    className="ml-2 font-semibold underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                Loading resource...
              </div>
            ) : (
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
                    rows={5}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </main>
      </>
    </ProtectedRoute>
  );
}
