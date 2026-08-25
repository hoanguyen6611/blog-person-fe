"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const FilterSheet = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" data-testid="filter-sheet">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        data-testid="filter-sheet-backdrop"
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col gap-4 rounded-t-[20px] border-t border-line bg-surface px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_-4px_rgba(15,23,42,.10)]">
        <div className="mx-auto h-1 w-9 flex-none rounded-full bg-line" />
        <div className="flex flex-none items-center">
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted"
            data-testid="filter-sheet-close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-2">{children}</div>
      </div>
    </div>
  );
};

export default FilterSheet;
