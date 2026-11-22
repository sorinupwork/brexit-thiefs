"use client";

interface WarningWatermarkOverlayProps {
  stampText?: string;
  tone?: "light" | "dark";
  stampPlacement?: "center" | "top-right" | "bottom-right";
  compact?: boolean;
}

export function WarningWatermarkOverlay({
  stampText,
  tone = "light",
  stampPlacement = "center",
  compact = false,
}: WarningWatermarkOverlayProps) {
  const strokeClass =
    tone === "dark" ? "text-rose-400" : "text-rose-700";

  const gradientClass =
    tone === "dark"
      ? "from-rose-600/[0.14] via-transparent to-rose-950/[0.22]"
      : "from-rose-600/[0.06] via-transparent to-rose-500/[0.05]";

  const stampToneClass =
    tone === "dark"
      ? "border-rose-400/50 text-rose-300 bg-rose-950/35"
      : "border-rose-600/45 text-rose-700 bg-rose-50/40";

  const placementClass =
    stampPlacement === "top-right"
      ? "right-3 top-4 -rotate-6"
      : stampPlacement === "bottom-right"
        ? "bottom-12 right-3 -rotate-6"
        : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle atmospheric caution wash */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-opacity duration-700 ease-out group-hover:opacity-100`}
      />

      {/* Crisp architectural full-bleed X hairline with slow smooth breathing */}
      <svg
        viewBox="0 0 240 240"
        preserveAspectRatio="none"
        className={`animate-x-breathe absolute inset-0 h-full w-full ${strokeClass} transition-opacity duration-700 ease-out group-hover:opacity-[0.22]`}
      >
        <line
          x1="14"
          y1="14"
          x2="226"
          y2="226"
          stroke="currentColor"
          strokeWidth={compact ? "2.4" : "1.9"}
          strokeLinecap="round"
        />
        <line
          x1="226"
          y1="14"
          x2="14"
          y2="226"
          stroke="currentColor"
          strokeWidth={compact ? "2.4" : "1.9"}
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="14"
          x2="226"
          y2="218"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          opacity="0.55"
        />
        <line
          x1="218"
          y1="14"
          x2="14"
          y2="218"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          opacity="0.55"
        />
      </svg>

      {/* Restrained editorial stamp watermark */}
      {stampText && (
        <span
          className={`animate-stamp-breathe absolute whitespace-nowrap rounded-md border-2 border-dashed px-2.5 py-0.5 font-mono font-bold uppercase tracking-[0.2em] backdrop-blur-[1px] transition-opacity duration-700 ease-out group-hover:opacity-40 ${compact ? "text-[9px]" : "text-[11px]"
            } ${stampToneClass} ${placementClass}`}
        >
          ✕ {stampText}
        </span>
      )}
    </div>
  );
}

export function PortraitDenyOverlay({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-rose-950/10 to-rose-950/20 transition-opacity duration-700 ease-out" />
      <svg
        viewBox="0 0 100 100"
        className="animate-x-photo-breathe absolute inset-0 h-full w-full text-rose-400 transition-opacity duration-700 ease-out group-hover:opacity-75"
      >
        <line
          x1="12"
          y1="12"
          x2="88"
          y2="88"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line
          x1="88"
          y1="12"
          x2="12"
          y2="88"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-x-0 bottom-0 border-t border-rose-400/40 bg-rose-950/85 py-0.5 text-center font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-rose-200 backdrop-blur-[2px]">
        ✕ {label}
      </span>
    </div>
  );
}
