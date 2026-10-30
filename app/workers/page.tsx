"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WorkerCard } from "@/components/workers/WorkerCard";
import { FilterPanel, type Filters } from "@/components/workers/FilterPanel";
import type { Worker } from "@/types";

// useSearchParams() opts the route into client-side rendering, so Next.js
// requires it to sit under a Suspense boundary or the production build fails.
export default function WorkersPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 md:pt-32 pb-24 container-content">
          <p className="text-sm text-graphite-light">Loading professionals…</p>
        </div>
      }
    >
      <WorkersContent />
    </Suspense>
  );
}

function WorkersContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get("category") ?? "",
    city: searchParams.get("city") ?? "",
    gender: searchParams.get("gender") ?? "any",
    salaryType: searchParams.get("salaryType") ?? "",
    verifiedOnly: searchParams.get("verifiedOnly") === "true",
    q: searchParams.get("q") ?? "",
  });
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.gender && filters.gender !== "any") params.set("gender", filters.gender);
    if (filters.salaryType) params.set("salaryType", filters.salaryType);
    if (filters.verifiedOnly) params.set("verifiedOnly", "true");
    if (filters.q) params.set("q", filters.q);
    return params.toString();
  }, [filters]);

  // Keep the URL shareable/bookmarkable without going through Next.js
  // navigation (router.replace re-renders the route tree and can race with
  // the data fetch below). A plain history update has zero side effects.
  useEffect(() => {
    const url = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [queryString]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/workers${queryString ? `?${queryString}` : ""}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
        const data = await res.json();
        setWorkers(data.workers ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // A newer request superseded this one — ignore.
          return;
        }
        console.error("Failed to load workers:", err);
        setError("Something went wrong loading professionals. Please try again.");
        setWorkers([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkers();
    return () => controller.abort();
  }, [queryString]);

  return (
    <div className="pt-28 md:pt-32 pb-24 container-content">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Verified Professionals</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">
            Find the right person for your home
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="lg:hidden text-sm font-medium border border-ink rounded-xl px-4 py-2"
        >
          {mobileFiltersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-28">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <p className="text-sm text-graphite-light mb-5">
            {loading
              ? "Searching…"
              : error
              ? null
              : `${workers.length} professional${workers.length === 1 ? "" : "s"} found`}
          </p>

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-6 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && workers.length === 0 && (
            <div className="border border-line rounded-xl p-12 text-center">
              <p className="font-display text-xl">No matches for these filters</p>
              <p className="mt-2 text-graphite text-sm">
                Try a different city, service, or clear a filter to see more
                professionals.
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {workers.map((w) => (
              <WorkerCard key={w.id} worker={w} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
