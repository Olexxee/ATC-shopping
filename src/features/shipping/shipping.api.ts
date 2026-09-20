import { api } from "../../lib/api";
import type { StorefrontShipping } from "./shipping.types";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Public read of the active shipping configuration and its active rules.
 *
 * Returns `null` when no active configuration exists — the storefront
 * renders an empty state rather than an error.
 */
export async function getStorefrontShipping(): Promise<StorefrontShipping | null> {
  const res = await api.get<Envelope<StorefrontShipping | null>>(
    "/api/shipping/storefront",
  );

  return res.data.data;
}
