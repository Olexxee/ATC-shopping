import { X } from "lucide-react";
import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  widthClassName = "w-full sm:max-w-md",
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="
          absolute
          inset-0
          h-full
          w-full
          cursor-default
          bg-black/40
          opacity-100
          transition-opacity
          duration-200
          focus:outline-none
        "
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          absolute
          right-0
          top-0
          flex
          h-full
          ${widthClassName}
          flex-col
          bg-white
          shadow-[-12px_0_32px_rgb(0_0_0_/_0.12)]
        `}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] px-5">
          {title ? (
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              text-[var(--text-secondary)]
              transition-colors
              duration-200
              hover:bg-[var(--surface)]
              hover:text-[var(--text-primary)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
              focus-visible:ring-offset-2
            "
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}
