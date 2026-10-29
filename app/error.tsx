"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        We hit a snag.
      </h1>
      <p className="mt-4 text-graphite max-w-sm">
        Please try again. If the problem continues, reach us at
        hello@meun.in.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-xl bg-ink text-paper px-6 py-3 font-medium"
      >
        Try again
      </button>
    </div>
  );
}
