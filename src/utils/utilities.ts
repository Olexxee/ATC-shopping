
import { createElement } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export function EmptyBrands({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return createElement(
    "div",
    { className: "flex min-h-[280px] flex-col items-center justify-center px-6 text-center" },
    createElement(
      "div",
      { className: "flex h-12 w-12 items-center justify-center rounded-full bg-slate-100" },
      createElement("span", { className: "text-lg text-slate-400" }, "—"),
    ),
    createElement(
      "h3",
      { className: "mt-4 text-sm font-semibold text-slate-900" },
      hasFilters ? "No brands found" : "No brands yet",
    ),
    createElement(
      "p",
      { className: "mt-2 max-w-md text-sm text-slate-500" },
      hasFilters
        ? "Try adjusting your search or filters."
        : "Create your first brand to start organizing the catalog.",
    ),
    !hasFilters &&
      createElement(
        Link,
        {
          to: "/admin/brands/new",
          className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800",
        },
        createElement(Plus, { size: 15 }),
        "Create brand",
      ),
  );
}


export function BrandTableSkeleton() {
  return createElement(
    "div",
    { className: "divide-y divide-slate-100" },
    ...Array.from({ length: 6 }, (_, index) =>
      createElement(
        "div",
        { key: index, className: "flex items-center gap-4 px-5 py-4" },
        createElement("div", { className: "h-12 w-12 animate-pulse rounded-lg bg-slate-100" }),
        createElement(
          "div",
          { className: "min-w-0 flex-1" },
          createElement("div", { className: "h-4 w-40 animate-pulse rounded bg-slate-100" }),
          createElement("div", { className: "mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" }),
        ),
        createElement("div", { className: "hidden h-4 w-16 animate-pulse rounded bg-slate-100 md:block" }),
        createElement("div", { className: "hidden h-4 w-16 animate-pulse rounded bg-slate-100 md:block" }),
        createElement("div", { className: "h-4 w-16 animate-pulse rounded bg-slate-100" }),
      ),
    ),
  );
}

export function BrandPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const buttonClass = "rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
  const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((pageNumber) => pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1)
    .map((pageNumber) => createElement("button", {
      key: pageNumber,
      type: "button",
      onClick: () => onPageChange(pageNumber),
      className: `min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium transition ${pageNumber === page ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`,
    }, pageNumber));

  return createElement(
    "div",
    { className: "flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" },
    createElement("p", { className: "text-xs text-slate-500" }, "Showing ", createElement("span", { className: "font-medium text-slate-700" }, start), " to ", createElement("span", { className: "font-medium text-slate-700" }, end), " of ", createElement("span", { className: "font-medium text-slate-700" }, total)),
    createElement("div", { className: "flex items-center gap-1" },
      createElement("button", { type: "button", disabled: page === 1, onClick: () => onPageChange(page - 1), className: buttonClass }, "Previous"),
      ...pageButtons,
      createElement("button", { type: "button", disabled: page === totalPages, onClick: () => onPageChange(page + 1), className: buttonClass }, "Next"),
    ),
  );
}