"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    eyebrow: "Home Chefs, Verified",
    headline: "A cook you can\nactually trust.",
    subtext: "Background-checked, trained, and ready this week.",
    cta: "Browse Cooks",
    href: "/workers?category=cook",
    photoUrl: "https://images.pexels.com/photos/16894103/pexels-photo-16894103/free-photo-of-working-cook-behind-window.jpeg",
    badge: { top: "Book Today", big: "5", unit: "%", bottom: "OFF FIRST BOOKING" },
  },
  {
    eyebrow: "Repairs, Sorted",
    headline: "Electricians who\nshow up on time.",
    subtext: "Police-verified professionals, booked in minutes.",
    cta: "Book a Repair",
    href: "/workers?category=electrician",
    photoUrl: "https://images.pexels.com/photos/17842832/pexels-photo-17842832/free-photo-of-electrician-by-fuse-box.jpeg",
    badge: { top: "Guaranteed", big: "48", unit: "hrs", bottom: "REPLACEMENT PROMISE" },
  },
  {
    eyebrow: "Plumbing, Handled",
    headline: "Plumbers who\nfix it right.",
    subtext: "Verified, insured, and rated by 12,000+ homes.",
    cta: "Book a Plumber",
    href: "/workers?category=plumber",
    photoUrl: "https://images.pexels.com/photos/29226620/pexels-photo-29226620/free-photo-of-professional-plumber-installing-a-radiator-pipe.jpeg",
    badge: { top: "Rated", big: "4.8", unit: "★", bottom: "BY 12,000+ HOMES" },
  },
];

const CATEGORIES = [
  { value: "maid", label: "Maid" },
  { value: "cook", label: "Cook" },
  { value: "driver", label: "Driver" },
  { value: "babysitter", label: "Babysitter" },
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
];
const CITIES = ["Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];

export function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState("maid");
  const [city, setCity] = useState("Delhi NCR");

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="pt-16 md:pt-[72px]">
      <div className="relative bg-paper-dim overflow-hidden">
        <div className="container-content relative flex flex-col md:flex-row items-center min-h-[460px] md:min-h-[540px] py-10 md:py-0">
          <div className="md:w-[30%] z-10">
            <p className="text-sm font-medium text-graphite">{slide.eyebrow}</p>
            <h1 className="mt-3 font-display font-extrabold text-ink text-3xl md:text-[2.6rem] leading-[1.1] whitespace-pre-line">
              {slide.headline}
            </h1>
            <div className="mt-5 w-10 border-t-2 border-ink" />
            <p className="mt-5 text-graphite italic">{slide.subtext}</p>
            <Link
              href={slide.href}
              className="mt-7 inline-flex items-center rounded-lg bg-ink text-white font-semibold px-7 py-3.5 hover:bg-ink-soft transition-colors"
            >
              {slide.cta}
            </Link>
          </div>

          <div className="mt-10 md:mt-0 md:absolute md:right-[13%] md:top-1/2 md:-translate-y-1/2 md:h-[85%] w-full md:w-[46%] aspect-[4/3] md:aspect-auto relative rounded-2xl overflow-hidden">
            <Image
              src={slide.photoUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 46vw, 100vw"
              priority={index === 0}
            />
          </div>

          <div className="hidden lg:flex flex-col items-end text-right absolute right-6 top-10 z-10">
            <span className="text-sm text-graphite">{slide.badge.top}</span>
            <span className="font-display font-extrabold text-ink text-6xl leading-none mt-1">
              {slide.badge.big}
              <span className="text-2xl align-top">{slide.badge.unit}</span>
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wide2 text-graphite">
              {slide.badge.bottom}
            </span>
          </div>

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-paper shadow-card text-ink z-30 pointer-events-auto"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-paper shadow-card text-ink z-30 pointer-events-auto"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 pb-5">
          {SLIDES.map((s, i) => (
            <button
              type="button"
              key={s.headline}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                "h-1.5 rounded-full transition-all " +
                (i === index ? "w-6 bg-ink" : "w-1.5 bg-line-dark/20")
              }
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/workers?category=${category}&city=${encodeURIComponent(city)}`);
        }}
        className="container-content -mt-px flex flex-col sm:flex-row items-stretch gap-2 border-b border-line py-4"
      >
        <label className="sr-only" htmlFor="hero-category">Service</label>
        <select
          id="hero-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-medium bg-paper focus:outline-none focus:border-ink"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="hero-city">City</label>
        <select
          id="hero-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-medium bg-paper focus:outline-none focus:border-ink"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-ink text-white font-semibold px-6 py-2.5 text-sm hover:bg-ink-soft transition-colors"
        >
          Search
        </button>
      </form>
    </section>
  );
}
