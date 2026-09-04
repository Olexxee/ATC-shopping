import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  listingStateToParams,
  parseProductListingSearch,
  type ProductListingState,
  type ProductSortValue,
} from "./products-listing.utils";

export function useProductDiscovery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo<ProductListingState>(
    () => parseProductListingSearch(searchParams),
    [searchParams],
  );

  const params = useMemo(() => listingStateToParams(state), [state]);

  function updateParam(key: string, value?: string) {
    const next = new URLSearchParams(searchParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  }

  function setSort(value: ProductSortValue) {
    updateParam("sort", value);
  }

  function setSearch(value: string) {
    updateParam("search", value);
  }

  function clearFilters() {
    const next = new URLSearchParams();

    const search = searchParams.get("search");

    if (search) {
      next.set("search", search);
    }

    setSearchParams(next);
  }

  return {
    state,
    params,

    setSort,
    setSearch,

    updateParam,

    clearFilters,
  };
}
