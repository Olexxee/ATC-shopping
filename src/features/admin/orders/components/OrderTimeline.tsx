// src/features/admin/orders/components/OrderTimeline.tsx

import { Circle } from "lucide-react";

import type { OrderTimelineEvent } from "../order.types";

interface OrderTimelineProps {
  events: OrderTimelineEvent[];
  loading?: boolean;
}

export function OrderTimeline({ events, loading = false }: OrderTimelineProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Loading order timeline...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No timeline events found.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {events.map((event, index) => (
        <div
          key={`${event.timestamp}-${index}`}
          className="relative flex gap-3"
        >
          <div className="relative flex w-5 justify-center">
            <Circle className="relative z-10 mt-1 h-3 w-3 fill-current text-blue-500" />

            {index < events.length - 1 && (
              <span className="absolute top-4 bottom-[-20px] w-px bg-slate-200" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-1 sm:flex-row">
              <p className="text-sm font-semibold text-slate-900">
                {event.status}
              </p>

              <time className="text-xs text-slate-400">
                {new Date(event.timestamp).toLocaleString("en-NG")}
              </time>
            </div>

            <p className="mt-1 text-sm text-slate-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
