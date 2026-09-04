import type { GetProductsParams } from "../../api/product/products.api";

export type ProductSortValue =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface ProductListingState {
  search?: string;

  categoryId?: string;
  brandId?: string;
  collectionId?: string;

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  minPrice?: number;
  maxPrice?: number;

  sort: ProductSortValue;
}

export const DEFAULT_PRODUCT_LISTING_STATE: ProductListingState = {
  sort: "recommended",
};

export const PRODUCT_SORT_OPTIONS: {
  value: ProductSortValue;
  label: string;
}[] = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A–Z",
  },
  {
    value: "name-desc",
    label: "Name: Z–A",
  },
];

export function parseBoolean(value: string | null): boolean | undefined {
  return value === "true" ? true : undefined;
}

export function parseNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

export function parseProductListingSearch(
  searchParams: URLSearchParams,
): ProductListingState {
  const sort = searchParams.get("sort");

  const validSort = PRODUCT_SORT_OPTIONS.some(
    (option) => option.value === sort,
  );

  return {
    search: searchParams.get("search") || undefined,

    categoryId: searchParams.get("categoryId") || undefined,

    brandId: searchParams.get("brandId") || undefined,

    collectionId: searchParams.get("collectionId") || undefined,

    isFeatured: parseBoolean(searchParams.get("isFeatured")),

    isNew: parseBoolean(searchParams.get("isNew")),

    isBestSeller: parseBoolean(searchParams.get("isBestSeller")),

    minPrice: parseNumber(searchParams.get("minPrice")),

    maxPrice: parseNumber(searchParams.get("maxPrice")),

    sort: validSort
      ? (sort as ProductSortValue)
      : DEFAULT_PRODUCT_LISTING_STATE.sort,
  };
}

export function listingStateToParams(
  state: ProductListingState,
): Omit<GetProductsParams, "page"> {
  const params: Omit<GetProductsParams, "page"> = {
    limit: 20,
  };

  if (state.search) {
    params.search = state.search;
  }

  if (state.categoryId) {
    params.categoryId = state.categoryId;
  }

  if (state.brandId) {
    params.brandId = state.brandId;
  }

  if (state.collectionId) {
    params.collectionId = state.collectionId;
  }

  if (state.isFeatured) {
    params.isFeatured = true;
  }

  if (state.isNew) {
    params.isNew = true;
  }

  if (state.isBestSeller) {
    params.isBestSeller = true;
  }

  if (state.minPrice !== undefined) {
    params.minPrice = state.minPrice;
  }

  if (state.maxPrice !== undefined) {
    params.maxPrice = state.maxPrice;
  }

  switch (state.sort) {
    case "newest":
      params.sortBy = "createdAt";
      params.sortOrder = "desc";
      break;

    case "price-asc":
      params.sortBy = "price";
      params.sortOrder = "asc";
      break;

    case "price-desc":
      params.sortBy = "price";
      params.sortOrder = "desc";
      break;

    case "name-asc":
      params.sortBy = "name";
      params.sortOrder = "asc";
      break;

    case "name-desc":
      params.sortBy = "name";
      params.sortOrder = "desc";
      break;

    case "recommended":
    default:
      break;
  }

  return params;
}

export function updateProductListingUrl(state: ProductListingState): void {
  const params = new URLSearchParams();

  if (state.search) {
    params.set("search", state.search);
  }

  if (state.categoryId) {
    params.set("categoryId", state.categoryId);
  }

  if (state.brandId) {
    params.set("brandId", state.brandId);
  }

  if (state.collectionId) {
    params.set("collectionId", state.collectionId);
  }

  if (state.isFeatured) {
    params.set("isFeatured", "true");
  }

  if (state.isNew) {
    params.set("isNew", "true");
  }

  if (state.isBestSeller) {
    params.set("isBestSeller", "true");
  }

  if (state.minPrice !== undefined) {
    params.set("minPrice", String(state.minPrice));
  }

  if (state.maxPrice !== undefined) {
    params.set("maxPrice", String(state.maxPrice));
  }

  if (state.sort !== "recommended") {
    params.set("sort", state.sort);
  }

  const query = params.toString();

  window.history.pushState({}, "", query ? `/products?${query}` : "/products");
}
