export const cartKeys = {
  all: ["cart"] as const,

  detail: () => [...cartKeys.all, "detail"] as const,

  summary: () => [...cartKeys.all, "summary"] as const,

  validation: () => [...cartKeys.all, "validation"] as const,
};
