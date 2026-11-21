interface SectionSkeletonProps {
  sectionClassName?: string;
  cardClassName?: string;
}

/**
 * Reusable Suspense fallback block for full-width page sections.
 */
export function SectionSkeleton({
  sectionClassName = "bg-white py-16",
  cardClassName = "h-72 border-slate-200 bg-slate-100",
}: SectionSkeletonProps) {
  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`animate-pulse rounded-2xl border ${cardClassName}`}
        />
      </div>
    </section>
  );
}
