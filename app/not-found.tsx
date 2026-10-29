import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        This page wandered off.
      </h1>
      <p className="mt-4 text-graphite max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl bg-ink text-paper px-6 py-3 font-medium"
      >
        Back to home
      </Link>
    </div>
  );
}
