import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Truck } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { useAddCartItem } from "../../features/cart/cart.mutations";
import { useCurrentUser } from "../../features/auth/auth.queries";
import {
  useProductBySlug,
  useRelatedProducts,
} from "../../features/products/products.queries";
import type {
  StorefrontCard,
  StorefrontDetail,
  StorefrontDetailVariant,
} from "../../api/product/product.contract";

// ============================================================================
// PAGE
// ============================================================================

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const productQuery = useProductBySlug(slug ?? "");
  const product = productQuery.data;

  const addCartItemMutation = useAddCartItem();
  const relatedQuery = useRelatedProducts(product?.id ?? "", 4);

  if (productQuery.isLoading) {
    return <ProductPageSkeleton />;
  }

  if (productQuery.isError || !product) {
    return <ProductNotFound />;
  }

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedQuery.data ?? []}
      relatedLoading={relatedQuery.isLoading}
      addCartItemMutation={addCartItemMutation}
    />
  );
}

// ============================================================================
// DETAIL
// ============================================================================

interface ProductDetailProps {
  product: StorefrontDetail;
  relatedProducts: StorefrontCard[];
  relatedLoading: boolean;
  addCartItemMutation: ReturnType<typeof useAddCartItem>;
}

function ProductDetail({
  product,
  relatedProducts,
  relatedLoading,
  addCartItemMutation,
}: ProductDetailProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading: isAuthLoading } = useCurrentUser();

  const variants = product.variants;

  // ── Gallery ────────────────────────────────────────────────────────

  const allImages = useMemo(
    () =>
      variants.flatMap((variant) =>
        variant.media.map((media) => ({
          id: media.id,
          url: media.url,
          alt: media.alt ?? product.name,
          variantId: variant.id,
        })),
      ),
    [variants, product.name],
  );

  const galleryImages =
    allImages.length > 0
      ? allImages
      : product.image
        ? [
            {
              id: "fallback",
              url: product.image,
              alt: product.name,
              variantId: "",
            },
          ]
        : [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = galleryImages[selectedImageIndex];

  // ── Variant selection ──────────────────────────────────────────────

  const initialVariant =
    variants.find((v) => v.isActive && v.stock > 0) ?? variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    initialVariant?.id,
  );

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? initialVariant;

  const [quantity, setQuantity] = useState(1);

  const colors = useMemo(
    () =>
      [
        ...new Set(
          variants.map((v) => v.color).filter((c): c is string => Boolean(c)),
        ),
      ],
    [variants],
  );

  const sizes = useMemo(
    () =>
      [
        ...new Set(
          variants.map((v) => v.size).filter((s): s is string => Boolean(s)),
        ),
      ],
    [variants],
  );

  const selectedColor = selectedVariant?.color ?? null;
  const selectedSize = selectedVariant?.size ?? null;

  const hasMultipleColors = colors.length > 1;
  const hasMultipleSizes = sizes.length > 1;

  const selectVariantByAttributes = (
    color: string | null,
    size: string | null,
  ) => {
    const matching = variants.filter((v) => {
      const colorOk = color === null || v.color === color;
      const sizeOk = size === null || v.size === size;
      return colorOk && sizeOk;
    });

    if (!matching.length) return;

    const pick =
      matching.find((v) => v.isActive && v.stock > 0) ?? matching[0];

    setSelectedVariantId(pick.id);

    const imageIndex = galleryImages.findIndex((i) => i.variantId === pick.id);
    if (imageIndex >= 0) setSelectedImageIndex(imageIndex);

    setQuantity(1);
  };

  const handleColorChange = (color: string) =>
    selectVariantByAttributes(color, selectedSize);

  const handleSizeChange = (size: string) =>
    selectVariantByAttributes(selectedColor, size);

  // ── Pricing ────────────────────────────────────────────────────────
  //
  // Selected variant's price is authoritative once a variant is chosen.
  // Before that, we fall back to the product-level range minimum, which
  // the mapper guarantees is present.

  const price = selectedVariant
    ? selectedVariant.price
    : product.priceRange.min;

  const compareAtPrice = selectedVariant?.compareAtPrice ?? null;

  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // ── Cart ───────────────────────────────────────────────────────────

  const canIncreaseQuantity =
    Boolean(selectedVariant?.isActive) &&
    Boolean(selectedVariant && selectedVariant.stock > quantity);

  const canAddToCart = Boolean(
    selectedVariant && selectedVariant.isActive && selectedVariant.stock > 0,
  );

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.isActive || selectedVariant.stock <= 0) {
      return;
    }

    if (!user) {
      navigate("/auth/login", {
        state: {
          from: { pathname: location.pathname, search: location.search },
        },
      });
      return;
    }

    addCartItemMutation.mutate({
      variantId: selectedVariant.id,
      quantity,
    });
  };

  // ── Gallery navigation ─────────────────────────────────────────────

  const goToPreviousImage = () => {
    if (!galleryImages.length) return;
    setSelectedImageIndex((c) =>
      c === 0 ? galleryImages.length - 1 : c - 1,
    );
  };

  const goToNextImage = () => {
    if (!galleryImages.length) return;
    setSelectedImageIndex((c) =>
      c === galleryImages.length - 1 ? 0 : c + 1,
    );
  };

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 overflow-hidden text-sm text-neutral-500">
            <li className="shrink-0">
              <Link to="/products" className="transition hover:text-neutral-950">
                Products
              </Link>
            </li>

            {product.category && (
              <>
                <li aria-hidden="true" className="text-neutral-300">
                  /
                </li>
                <li className="shrink-0">
                  <Link
                    to={`/categories/${product.category.slug}`}
                    className="transition hover:text-neutral-950"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}

            <li aria-hidden="true" className="text-neutral-300">
              /
            </li>

            <li className="truncate text-neutral-900">{product.name}</li>
          </ol>
        </nav>

        {/* Main product */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:gap-16 xl:gap-20">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row">
              {galleryImages.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col">
                  {galleryImages.map((galleryImage, index) => (
                    <button
                      key={galleryImage.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View product image ${index + 1}`}
                      className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border bg-neutral-100 transition sm:w-20 ${
                        selectedImageIndex === index
                          ? "border-neutral-950"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <img
                        src={galleryImage.url}
                        alt={galleryImage.alt}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="order-1 min-w-0 flex-1 sm:order-2">
                <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={currentImage.alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                      <span className="text-sm text-neutral-400">
                        Image unavailable
                      </span>
                    </div>
                  )}

                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPreviousImage}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-950 opacity-0 shadow-sm backdrop-blur transition hover:bg-white group-hover:opacity-100"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={goToNextImage}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-950 opacity-0 shadow-sm backdrop-blur transition hover:bg-white group-hover:opacity-100"
                      >
                        <ChevronRight size={18} />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        {selectedImageIndex + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 lg:py-2">
            {(product.isNew || product.isBestSeller) && (
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900">
                    New arrival
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
                    Bestseller
                  </span>
                )}
              </div>
            )}

            {product.brand && (
              <Link
                to={`/brands/${product.brand.slug}`}
                className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:text-neutral-950"
              >
                {product.brand.name}
              </Link>
            )}

            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl xl:text-[42px]">
              {product.name}
            </h1>

            {product.totalReviews > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="tracking-[0.1em] text-neutral-950">
                  {"★".repeat(Math.round(product.avgRating))}
                  {"☆".repeat(Math.max(0, 5 - Math.round(product.avgRating)))}
                </span>
                <span className="font-medium text-neutral-900">
                  {product.avgRating.toFixed(1)}
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-500">
                  {product.totalReviews}{" "}
                  {product.totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold tracking-tight text-neutral-950">
                ₦{price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-neutral-400 line-through">
                    ₦{compareAtPrice!.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {product.priceRange.min !== product.priceRange.max && (
              <p className="mt-1 text-xs text-neutral-500">
                Price varies by variant
              </p>
            )}

            {product.description && (
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color */}
            {hasMultipleColors && (
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-950">Color</p>
                  {selectedColor && (
                    <span className="text-sm text-neutral-500">
                      {selectedColor}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const isSelected = selectedColor === color;
                    const isAvailable = variants.some(
                      (v) => v.color === color && v.isActive && v.stock > 0,
                    );

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        disabled={!isAvailable}
                        className={`rounded-full border px-4 py-2.5 text-sm transition ${
                          isSelected
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-950"
                        } disabled:cursor-not-allowed disabled:opacity-35`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {hasMultipleSizes && (
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-950">Size</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-950"
                  >
                    Size guide
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const isAvailable = variants.some(
                      (v) =>
                        v.size === size &&
                        (selectedColor === null || v.color === selectedColor) &&
                        v.isActive &&
                        v.stock > 0,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailable}
                        className={`flex h-11 items-center justify-center rounded-xl border text-sm transition ${
                          isSelected
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-950"
                        } disabled:cursor-not-allowed disabled:opacity-35`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Availability */}
            {selectedVariant && (
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-950">
                    Availability
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      selectedVariant.stock > 0 && selectedVariant.isActive
                        ? "text-neutral-700"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant.stock > 0 && selectedVariant.isActive
                      ? selectedVariant.stock <= 5
                        ? `Only ${selectedVariant.stock} left`
                        : "In stock"
                      : "Out of stock"}
                  </p>
                </div>

                {selectedVariant.sku && (
                  <p className="mt-2 text-xs text-neutral-400">
                    SKU: {selectedVariant.sku}
                  </p>
                )}
              </div>
            )}

            {/* Quantity + add to cart */}
            <div className="mt-8 border-t border-neutral-200 pt-7">
              <div className="flex gap-3">
                <div className="flex h-12 shrink-0 items-center rounded-full border border-neutral-200">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((c) => Math.max(1, c - 1))
                    }
                    disabled={quantity <= 1 || addCartItemMutation.isPending}
                    aria-label="Decrease quantity"
                    className="flex h-full w-11 items-center justify-center text-neutral-700 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-8 text-center text-sm font-medium text-neutral-950">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((c) =>
                        Math.min(selectedVariant?.stock ?? c, c + 1),
                      )
                    }
                    disabled={!canIncreaseQuantity || addCartItemMutation.isPending}
                    aria-label="Increase quantity"
                    className="flex h-full w-11 items-center justify-center text-neutral-700 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    !canAddToCart ||
                    addCartItemMutation.isPending ||
                    isAuthLoading
                  }
                  className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  {addCartItemMutation.isPending
                    ? "Adding..."
                    : !canAddToCart
                      ? "Out of stock"
                      : "Add to cart"}
                </button>
              </div>

              {addCartItemMutation.isSuccess && (
                <p className="mt-3 text-sm text-neutral-600">
                  Added to your cart.
                </p>
              )}

              {addCartItemMutation.isError && (
                <p className="mt-3 text-sm text-red-600">
                  Unable to add this item to your cart. Please try again.
                </p>
              )}
            </div>

            {/* Shipping */}
            {selectedVariant && (
              <div className="mt-8 space-y-3 border-t border-neutral-200 pt-7">
                <div className="flex gap-3">
                  <Truck size={18} className="mt-0.5 shrink-0 text-neutral-700" />
                  <div>
                    <p className="text-sm font-medium text-neutral-950">
                      Delivery & fulfillment
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {getFulfillmentLabel(selectedVariant.fulfillmentType)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                  <span className="text-xs text-neutral-500">
                    Shipping method
                  </span>
                  <span className="text-xs font-medium text-neutral-900">
                    {getShippingLabel(selectedVariant.shippingType)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Details */}
        <section className="mt-20 border-t border-neutral-200 pt-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Product details
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                Everything you need to know
              </h2>
            </div>

            <div className="md:col-span-2">
              {product.description ? (
                <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-neutral-500">
                  Product details are currently unavailable.
                </p>
              )}

              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
                {product.brand && (
                  <DetailItem label="Brand" value={product.brand.name} />
                )}
                {product.category && (
                  <DetailItem label="Category" value={product.category.name} />
                )}
                {product.collection && (
                  <DetailItem
                    label="Collection"
                    value={product.collection.name}
                  />
                )}
                {selectedVariant?.sku && (
                  <DetailItem label="SKU" value={selectedVariant.sku} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {relatedLoading ? (
          <section className="mt-24 border-t border-neutral-200 pt-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                More to explore
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                You may also like
              </h2>
            </div>
            <div className="mt-8">
              <ProductGridSkeleton count={4} />
            </div>
          </section>
        ) : relatedProducts.length > 0 ? (
          <section className="mt-24 border-t border-neutral-200 pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  More to explore
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  You may also like
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden text-sm font-medium text-neutral-900 underline-offset-4 hover:underline sm:block"
              >
                View all
              </Link>
            </div>
            <div className="mt-8">
              <ProductGrid products={relatedProducts} />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-neutral-950">{value}</p>
    </div>
  );
}

function getFulfillmentLabel(fulfillmentType: StorefrontDetailVariant["fulfillmentType"]) {
  switch (fulfillmentType) {
    case "LOCAL":
      return "Fulfilled locally and prepared for delivery.";
    case "IMPORT":
      return "Imported item. Delivery timing may vary.";
    case "PREORDER":
      return "Pre-order item. Availability follows the seller's stated schedule.";
    case "DIGITAL":
      return "Digital product. Available electronically after purchase.";
    default:
      return "Fulfillment information is available at checkout.";
  }
}

function getShippingLabel(shippingType: StorefrontDetailVariant["shippingType"]) {
  switch (shippingType) {
    case "LOCAL":
      return "Local delivery";
    case "IMPORT":
      return "Import delivery";
    case "SEA":
      return "Sea freight";
    case "AIR":
      return "Air freight";
    default:
      return "Standard shipping";
  }
}

// ============================================================================
// SKELETON / NOT FOUND
// ============================================================================

function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-neutral-100" />

        <div className="grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:gap-16">
          <div className="aspect-square rounded-3xl bg-neutral-100" />

          <div className="py-4">
            <div className="h-3 w-24 rounded bg-neutral-100" />
            <div className="mt-5 h-10 w-4/5 rounded bg-neutral-100" />
            <div className="mt-4 h-4 w-40 rounded bg-neutral-100" />
            <div className="mt-7 h-8 w-36 rounded bg-neutral-100" />

            <div className="mt-8 border-t border-neutral-100 pt-8">
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-neutral-100" />
                <div className="h-4 w-5/6 rounded bg-neutral-100" />
                <div className="h-4 w-2/3 rounded bg-neutral-100" />
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-100 pt-8">
              <div className="h-4 w-16 rounded bg-neutral-100" />
              <div className="mt-4 flex gap-2">
                <div className="h-11 w-20 rounded-xl bg-neutral-100" />
                <div className="h-11 w-20 rounded-xl bg-neutral-100" />
                <div className="h-11 w-20 rounded-xl bg-neutral-100" />
              </div>
            </div>

            <div className="mt-8 h-12 w-full rounded-full bg-neutral-100" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Product
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          Product not found
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
          The product you're looking for doesn't exist or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}