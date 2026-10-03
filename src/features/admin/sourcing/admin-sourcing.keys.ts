import type { AdminSourcingListParams } from "./admin-sourcing.types";

export const adminSourcingKeys = {
  all: ["admin", "sourcing"] as const,

  lists: () => [...adminSourcingKeys.all, "list"] as const,

  list: (params?: AdminSourcingListParams) =>
    [...adminSourcingKeys.lists(), params] as const,

  details: () => [...adminSourcingKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...adminSourcingKeys.details(), id] as const,
};
