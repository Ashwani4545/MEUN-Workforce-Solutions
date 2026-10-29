"use client";

const CATEGORIES = [
  { value: "", label: "All services" },
  { value: "maid", label: "Maid" },
  { value: "cook", label: "Cook" },
  { value: "driver", label: "Driver" },
  { value: "babysitter", label: "Babysitter" },
  { value: "elder-care", label: "Elder Care" },
  { value: "security-guard", label: "Security Guard" },
  { value: "office-boy", label: "Office Boy" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "cleaner", label: "Cleaner" },
  { value: "gardener", label: "Gardener" },
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "ac-repair", label: "AC Repair" },
  { value: "carpenter", label: "Carpenter" },
  { value: "deep-cleaning", label: "Deep Cleaning" },
];

const CITIES = ["", "Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];

export interface Filters {
  category: string;
  city: string;
  gender: string;
  salaryType: string;
  verifiedOnly: boolean;
  q: string;
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="q" className="text-sm font-medium">Search</label>
        <input
          id="q"
          type="text"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Name or specific service"
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2 text-sm focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium">Service</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2 text-sm focus:border-ink"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="text-sm font-medium">City</label>
        <select
          id="city"
          value={filters.city}
          onChange={(e) => set("city", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2 text-sm focus:border-ink"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c || "All cities"}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Gender preference</legend>
        <div className="mt-1.5 flex gap-2">
          {["any", "female", "male"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("gender", g)}
              className={
                "flex-1 rounded-xl border px-2 py-1.5 text-xs capitalize transition-colors " +
                (filters.gender === g
                  ? "border-ink bg-ink text-white"
                  : "border-line text-graphite hover:border-graphite-light")
              }
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="salaryType" className="text-sm font-medium">Pay basis</label>
        <select
          id="salaryType"
          value={filters.salaryType}
          onChange={(e) => set("salaryType", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2 text-sm focus:border-ink"
        >
          <option value="">Any</option>
          <option value="monthly">Monthly</option>
          <option value="per-visit">Per visit</option>
          <option value="hourly">Hourly</option>
          <option value="per-job">Per job</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => set("verifiedOnly", e.target.checked)}
          className="h-4 w-4 accent-ink"
        />
        Fully verified only
      </label>
    </div>
  );
}
