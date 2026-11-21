"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import type { AgencyTeamMember } from "@/lib/agency-team";

interface MemberPhotoModalProps {
  member: AgencyTeamMember | null;
  titleId: string;
  closeLabel: string;
  onClose: () => void;
  footerAction?: ReactNode;
}

/**
 * Shared lightbox dialog for inspecting agency team member photos cleanly.
 */
export function MemberPhotoModal({
  member,
  titleId,
  closeLabel,
  onClose,
  footerAction,
}: MemberPhotoModalProps) {
  useEffect(() => {
    if (!member) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [member, onClose]);

  if (!member || !member.photoPath) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h3 id={titleId} className="text-base font-semibold text-slate-950">
              {member.name}
            </h3>
            <p className="text-xs text-slate-600">{member.headline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo view"
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {closeLabel}
          </button>
        </div>

        <div className="relative aspect-square w-full bg-slate-100">
          <Image
            src={member.photoPath}
            alt={member.photoAlt}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-contain"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3.5">
          <span className="font-mono text-[11px] text-slate-600">
            {member.sourceNote}
          </span>
          {footerAction}
        </div>
      </div>
    </div>
  );
}
