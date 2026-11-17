
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { resourceService } from "@/services/resource.service";
import { authStorage } from "@/lib/auth-storage";

export default function ResourceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [resource, setResource] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadResource = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await resourceService.getById(id);
      setResource(data);
    } catch (err) {
      setError(err.message || "Unable to load this resource.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setUser(authStorage.getUser());
    loadResource();
  }, [loadResource]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await resourceService.delete(id);
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to delete this resource.");
      setDeleting(false);
    }
  }

  const isOwner =
    user &&
    resource &&
    String(user.id) === String(resource.user_id);

  return (
    <>
      <Navbar />

      <main className="container-main py-10">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to resources
        </Link>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading resource...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadResource}
              className="mt-4 font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        ) : resource ? (
          <article className="card mx-auto max-w-3xl p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {resource.subject}
              </span>

              <span className="text-sm text-slate-500">
                {resource.created_at
                  ? new Date(resource.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-slate-900">
              {resource.title}
            </h1>

            <p className="mb-6 text-sm text-slate-500">
              Uploaded by: {resource.uploader_name || "Student"}
            </p>

            <div className="mb-6">
              <h2 className="mb-2 font-semibold text-slate-900">
                Description
              </h2>
              <p className="whitespace-pre-wrap leading-7 text-slate-600">
                {resource.description || "No description provided."}
              </p>
            </div>

            {resource.isbn && (
              <div className="mb-6">
                <h2 className="mb-2 font-semibold text-slate-900">
                  ISBN
                </h2>
                <p className="text-slate-600">{resource.isbn}</p>
              </div>
            )}

            {resource.file_name && (
              <div className="mb-6">
                <h2 className="mb-2 font-semibold text-slate-900">
                  Attached File
                </h2>
                <p className="text-sm text-slate-600">
                  {resource.file_name}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              {resource.download_url && (
                <a
                  href={resource.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Download PDF
                </a>
              )}

              {isOwner && (
                <>
                  <Link
                    href={`/resources/${resource.id}/edit`}
                    className="rounded-lg bg-amber-100 px-5 py-3 font-semibold text-amber-800 hover:bg-amber-200"
                  >
                    Edit Resource
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-100 px-5 py-3 font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete Resource"}
                  </button>
                </>
              )}
            </div>
          </article>
        ) : (
          <div className="py-16 text-center text-slate-500">
            Resource not found.
          </div>
        )}
      </main>
    </>
  );
}
