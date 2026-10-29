"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { stockPhoto } from "@/lib/stockPhoto";

// Tile width + gap, in px — must match the inline style below (w-[210px] /
// md:w-[240px] and gap-4 / md:gap-5). Used to compute how far to shift the
// track per click. A transform-based slide is used instead of native
// scrollBy() so the carousel's behavior doesn't depend on browser-specific
// smooth-scroll support.
const TILE_WIDTH = 240;
const TILE_GAP = 20;
const STEP = TILE_WIDTH + TILE_GAP;
const VISIBLE_AT_ONCE = 4;

const CATEGORIES: { value: string; label: string; tileLabel: string }[] = [
  { value: "maid", label: "Maids", tileLabel: "Housekeeping" },
  { value: "cook", label: "Cooks", tileLabel: "Home Chefs" },
  { value: "driver", label: "Drivers", tileLabel: "Personal & Outstation" },
  { value: "babysitter", label: "Babysitters", tileLabel: "Child Care" },
  { value: "elder-care", label: "Elder Care", tileLabel: "Companionship" },
  { value: "security-guard", label: "Security", tileLabel: "Guards" },
  { value: "electrician", label: "Electricians", tileLabel: "Wiring & Repair" },
  { value: "plumber", label: "Plumbers", tileLabel: "Leaks & Fittings" },
  { value: "ac-repair", label: "AC Repair", tileLabel: "Service & Install" },
  { value: "carpenter", label: "Carpenters", tileLabel: "Furniture & Fitting" },
];

// Real, category-matched photos found for these three. The rest fall back
// to generic (but real, freely-licensed) stock via Picsum — see
// lib/stockPhoto.ts for why an exact match isn't available for every
// category in this environment.
const REAL_PHOTOS: Record<string, string> = {
  cook: "https://images.pexels.com/photos/16894103/pexels-photo-16894103/free-photo-of-working-cook-behind-window.jpeg",
  electrician: "https://images.pexels.com/photos/17842832/pexels-photo-17842832/free-photo-of-electrician-by-fuse-box.jpeg",
  plumber: "https://images.pexels.com/photos/29226620/pexels-photo-29226620/free-photo-of-professional-plumber-installing-a-radiator-pipe.jpeg",
};

function photoFor(categoryValue: string): string {
  return REAL_PHOTOS[categoryValue] ?? stockPhoto(`meun-category-${categoryValue}`, 480, 600);
}

export function ServiceCategories() {
  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, CATEGORIES.length - VISIBLE_AT_ONCE);

  function goPrev() {
    setPage((p) => Math.max(0, p - 1));
  }
  function goNext() {
    setPage((p) => Math.min(maxPage, p + 1));
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container-content">
        <h2 className="font-display font-extrabold text-ink text-2xl md:text-[2rem]">
          Shop by Category
        </h2>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div
          className="container-content flex gap-4 md:gap-5 pb-2 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${page * STEP}px)` }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/workers?category=${cat.value}`}
              className="group shrink-0 w-[210px] md:w-[240px]"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={photoFor(cat.value)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-5 text-center font-display font-extrabold text-white text-2xl px-3">
                  {cat.label}
                </span>
              </div>
              <p className="mt-3 text-center text-sm text-graphite">{cat.tileLabel}</p>
            </Link>
          ))}
        </div>

        <div className="container-content flex justify-center gap-2 mt-6">
          <button
            type="button"
            aria-label="Previous categories"
            onClick={goPrev}
            disabled={page === 0}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-line hover:border-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next categories"
            onClick={goNext}
            disabled={page === maxPage}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-line hover:border-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
