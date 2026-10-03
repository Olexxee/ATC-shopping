import { ArrowRight, CalendarDays, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { AdminSourcingRequest } from "../admin-sourcing.types";
import { formatDate } from "../../../sourcing/utils/formatDate";
import { SourcingStatusBadge } from "../../../sourcing/components/SourcingStatusBadge";

interface AdminSourcingRowProps {
  request: AdminSourcingRequest;
}

export function AdminSourcingRow({ request }: AdminSourcingRowProps) {
  const image = request.referenceImages?.[0]?.url;

  return (
    <Link
      to={`/admin/sourcing/${request.id}`}
      className="group block px-4 py-4 transition-colors hover:bg-neutral-50 sm:px-5"
    >
      <div className="flex gap-4 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(160px,1fr)_140px_110px] lg:items-center lg:gap-4">
        {/* Request */}
        <div className="flex min-w-0 gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
            {image ? (
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                <ImageIcon size={18} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">
              {request.title}
            </p>

            <p className="mt-1 text-xs font-medium text-neutral-400">
              {request.requestNumber}
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500 lg:hidden">
              <CalendarDays size={13} />
              {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        {/* Customer — `fullName`, not `name` */}
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm font-medium text-neutral-800">
            {request.user?.fullName || "Unknown customer"}
          </p>

          <p className="mt-1 truncate text-xs text-neutral-400">
            {request.user?.email || "No email"}
          </p>
        </div>

        {/* Status */}
        <div className="hidden lg:block">
          <SourcingStatusBadge status={request.status} />
        </div>

        {/* Date / mobile status */}
        <div className="flex shrink-0 flex-col items-end gap-2 lg:items-start">
          <div className="lg:hidden">
            <SourcingStatusBadge status={request.status} />
          </div>

          <span className="hidden text-xs text-neutral-400 lg:block">
            {formatDate(request.createdAt)}
          </span>

          <ArrowRight
            size={16}
            className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-700"
          />
        </div>
      </div>
    </Link>
  );
}
