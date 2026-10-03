export const installmentKeys = {
  all: ["installments"] as const,

  lists: () => [...installmentKeys.all, "list"] as const,

  list: () => [...installmentKeys.lists()] as const,

  details: () => [...installmentKeys.all, "detail"] as const,

  detail: (planId: string) => [...installmentKeys.details(), planId] as const,
};
