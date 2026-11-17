
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { resourceService } from "@/services/resource.service";
import { authStorage } from "@/lib/auth-storage";

export default function HomePage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadResources = useCallback(async (subject = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await resourceService.getAll(subject);
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUser(authStorage.getUser());
    loadResources();
  }, [loadResources]);

  async function handleSearch(event) {
    event.preventDefault();
    loadResources(search.trim());
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      setDeletingId(id);
      await resourceService.delete(id);
      setResources((previous) =>
        previous.filter((resource) => resource.id !== id)
      );
    } catch (err) {
      alert(err.message || "Unable to delete resource.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container-main py-10">
        <section className="mb-10 rounded-2xl bg-slate-900 px-6 py-12 text-white md:px-12">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Share Knowledge. Learn Together.
          </h1>

          <p className="mb-7 max-w-2xl text-slate-300">
            Discover and share study notes, books, and educational resources
            with the StudyShare community.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources by subject..."
              className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3 text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </section>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Study Resources
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse resources shared by students.
            </p>
          </div>

          {user && (
            <Link
              href="/upload"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Upload Resource
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
            <button
              onClick={() => loadResources(search.trim())}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No resources found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another subject or check back later.
            </p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  loadResources("");
                }}
                className="mt-4 font-semibold text-blue-600"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const isOwner =
                user && String(user.id) === String(resource.user_id);

              return (
                <article
                  key={resource.id}
                  className="card flex flex-col p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {resource.subject}
                    </span>

                    <span className="text-xs text-slate-400">
                      {resource.created_at
                        ? new Date(resource.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    {resource.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                    {resource.description || "No description provided."}
                  </p>

                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <p className="mb-3 text-xs text-slate-500">
                      Uploaded by: {resource.uploader_name || "Student"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/resources/${resource.id}`}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        View Details
                      </Link>

                      {resource.download_url && (
                        <a
                          href={resource.download_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Download
                        </a>
                      )}

                      {isOwner && (
                        <>
                          <Link
                            href={`/resources/${resource.id}/edit`}
                            className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(resource.id)}
                            disabled={deletingId === resource.id}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                          >
                            {deletingId === resource.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
