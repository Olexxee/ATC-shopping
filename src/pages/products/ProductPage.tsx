import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Truck } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { ReviewStars } from "../../components/review/ReviewStars";
import { ReviewSection } from "../../components/review/ReviewSection";
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

  // ==========================================================================
  // GALLERY
  // ==========================================================================

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

  // ==========================================================================
  // VARIANT SELECTION
  // ==========================================================================

  const initialVariant =
    variants.find((v) => v.isActive && v.stock > 0) ?? variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(initialVariant?.id);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? initialVariant;

  const [quantity, setQuantity] = useState(1);

  const colors = useMemo(
    () => [
      ...new Set(
        variants.map((v) => v.color).filter((c): c is string => Boolean(c)),
      ),
    ],
    [variants],
  );

  const sizes = useMemo(
    () => [
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

    const pick = matching.find((v) => v.isActive && v.stock > 0) ?? matching[0];

    setSelectedVariantId(pick.id);

    const imageIndex = galleryImages.findIndex(
      (image) => image.variantId === pick.id,
    );

    if (imageIndex >= 0) {
      setSelectedImageIndex(imageIndex);
    }

    setQuantity(1);
  };

  const handleColorChange = (color: string) =>
    selectVariantByAttributes(color, selectedSize);

  const handleSizeChange = (size: string) =>
    selectVariantByAttributes(selectedColor, size);

  // ==========================================================================
  // PRICING
  // ==========================================================================

  const price = selectedVariant
    ? selectedVariant.price
    : product.priceRange.min;

  const compareAtPrice = selectedVariant?.compareAtPrice ?? null;

  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // ==========================================================================
  // CART
  // ==========================================================================

  const canIncreaseQuantity =
    Boolean(selectedVariant?.isActive) &&
    Boolean(selectedVariant && selectedVariant.stock > quantity);

  const canAddToCart = Boolean(
    selectedVariant && selectedVariant.isActive && selectedVariant.stock > 0,
  );

  const handleAddToCart = () => {
    if (
      !selectedVariant ||
      !selectedVariant.isActive ||
      selectedVariant.stock <= 0
    ) {
      return;
    }

    if (!user) {
      navigate("/auth/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        },
      });

      return;
    }

    addCartItemMutation.mutate({
      variantId: selectedVariant.id,
      quantity,
    });
  };

  // ==========================================================================
  // GALLERY NAVIGATION
  // ==========================================================================

  const goToPreviousImage = () => {
    if (!galleryImages.length) return;

    setSelectedImageIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const goToNextImage = () => {
    if (!galleryImages.length) return;

    setSelectedImageIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        {/* ================================================================== */}
        {/* Breadcrumb                                                         */}
        {/* ================================================================== */}

        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 overflow-hidden text-sm">
            <li className="shrink-0">
              <Link
                to="/products"
                className="
                  text-[var(--text-muted)]
                  transition-colors
                  duration-200
                  hover:text-[var(--brand)]
                "
              >
                Products
              </Link>
            </li>

            {product.category && (
              <>
                <li aria-hidden="true" className="text-[var(--border-strong)]">
                  /
                </li>

                <li className="shrink-0">
                  <Link
                    to={`/categories/${product.category.slug}`}
                    className="
                      text-[var(--text-muted)]
                      transition-colors
                      duration-200
                      hover:text-[var(--brand)]
                    "
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}

            <li aria-hidden="true" className="text-[var(--border-strong)]">
              /
            </li>

            <li className="truncate text-[var(--text-primary)]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ================================================================== */}
        {/* Main Product                                                       */}
        {/* ================================================================== */}

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:gap-16 xl:gap-20">
          {/* ================================================================= */}
          {/* Gallery                                                           */}
          {/* ================================================================= */}

          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row">
              {galleryImages.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col">
                  {galleryImages.map((galleryImage, index) => {
                    const isSelected = selectedImageIndex === index;

                    return (
                      <button
                        key={galleryImage.id}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`View product image ${index + 1}`}
                        aria-pressed={isSelected}
                        className={`
                          relative
                          aspect-square
                          w-16
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          border
                          bg-[var(--surface)]
                          transition-colors
                          duration-200
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--brand)]
                          focus-visible:ring-offset-2
                          sm:w-20
                          ${
                            isSelected
                              ? "border-[var(--brand)]"
                              : "border-[var(--border)] hover:border-[var(--border-strong)]"
                          }
                        `}
                      >
                        <img
                          src={galleryImage.url}
                          alt={galleryImage.alt}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="order-1 min-w-0 flex-1 sm:order-2">
                <div className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--surface)]">
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={currentImage.alt}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-[1.02]
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                      <span className="text-sm text-[var(--text-muted)]">
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
                        className="
                          absolute
                          left-4
                          top-1/2
                          flex
                          h-10
                          w-10
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-[var(--text-primary)]
                          opacity-0
                          shadow-sm
                          backdrop-blur
                          transition-opacity
                          duration-200
                          hover:bg-white
                          focus-visible:opacity-100
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--brand)]
                          focus-visible:ring-offset-2
                          group-hover:opacity-100
                        "
                      >
                        <ChevronLeft size={18} strokeWidth={1.8} />
                      </button>

                      <button
                        type="button"
                        onClick={goToNextImage}
                        aria-label="Next image"
                        className="
                          absolute
                          right-4
                          top-1/2
                          flex
                          h-10
                          w-10
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-[var(--text-primary)]
                          opacity-0
                          shadow-sm
                          backdrop-blur
                          transition-opacity
                          duration-200
                          hover:bg-white
                          focus-visible:opacity-100
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--brand)]
                          focus-visible:ring-offset-2
                          group-hover:opacity-100
                        "
                      >
                        <ChevronRight size={18} strokeWidth={1.8} />
                      </button>

                      <div
                        className="
                          absolute
                          bottom-4
                          left-1/2
                          -translate-x-1/2
                          rounded-full
                          bg-black/60
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-white
                          backdrop-blur
                        "
                      >
                        {selectedImageIndex + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Product Information                                               */}
          {/* ================================================================= */}

          <div className="min-w-0 lg:py-1">
            {/* Badges */}

            {(product.isNew || product.isBestSeller) && (
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <span
                    className="
                      rounded-full
                      bg-[var(--brand-soft)]
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      leading-none
                      text-[var(--brand)]
                    "
                  >
                    New
                  </span>
                )}

                {product.isBestSeller && (
                  <span
                    className="
                      rounded-full
                      bg-[var(--foreground)]
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      leading-none
                      text-white
                    "
                  >
                    Bestseller
                  </span>
                )}
              </div>
            )}

            {/* Brand */}

            {product.brand && (
              <Link
                to={`/brands/${product.brand.slug}`}
                className="
                  mt-5
                  inline-block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--text-muted)]
                  transition-colors
                  duration-200
                  hover:text-[var(--brand)]
                "
              >
                {product.brand.name}
              </Link>
            )}

            {/* Name */}

            <h1
              className="
                mt-2
                max-w-2xl
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.02em]
                text-[var(--text-primary)]
                sm:text-4xl
                xl:text-[42px]
              "
            >
              {product.name}
            </h1>

            {/* Reviews */}

            {product.totalReviews > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <ReviewStars rating={product.avgRating} size="sm" />

                <span className="font-medium text-[var(--text-primary)]">
                  {product.avgRating.toFixed(1)}
                </span>

                <span className="text-[var(--border-strong)]">|</span>

                <span className="text-[var(--text-muted)]">
                  {product.totalReviews.toLocaleString()}{" "}
                  {product.totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            {/* Price */}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span
                className="
                  text-2xl
                  font-semibold
                  leading-none
                  tracking-tight
                  text-[var(--text-primary)]
                  sm:text-3xl
                "
              >
                ₦{price.toLocaleString()}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-base text-[var(--text-muted)] line-through">
                    ₦{compareAtPrice!.toLocaleString()}
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-[var(--brand-soft)]
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-[var(--brand)]
                    "
                  >
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {product.priceRange.min !== product.priceRange.max && (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Price varies by variant
              </p>
            )}

            {/* =============================================================== */}
            {/* Color                                                           */}
            {/* =============================================================== */}

            {hasMultipleColors && (
              <div className="mt-8 border-t border-[var(--border)] pt-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Color
                  </p>

                  {selectedColor && (
                    <span className="text-sm text-[var(--text-muted)]">
                      {selectedColor}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const isSelected = selectedColor === color;

                    const isAvailable = variants.some(
                      (variant) =>
                        variant.color === color &&
                        variant.isActive &&
                        variant.stock > 0,
                    );

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        disabled={!isAvailable}
                        aria-pressed={isSelected}
                        className={`
                          rounded-full
                          border
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          transition-colors
                          duration-200
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--brand)]
                          focus-visible:ring-offset-2
                          ${
                            isSelected
                              ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                              : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                          }
                          disabled:cursor-not-allowed
                          disabled:opacity-35
                        `}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* Size                                                            */}
            {/* =============================================================== */}

            {hasMultipleSizes && (
              <div className="mt-8 border-t border-[var(--border)] pt-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Size
                  </p>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-medium
                      text-[var(--text-muted)]
                      underline
                      underline-offset-4
                      transition-colors
                      duration-200
                      hover:text-[var(--brand)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--brand)]
                      focus-visible:ring-offset-2
                    "
                  >
                    Size guide
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {sizes.map((size) => {
                    const isSelected = selectedSize === size;

                    const isAvailable = variants.some(
                      (variant) =>
                        variant.size === size &&
                        (selectedColor === null ||
                          variant.color === selectedColor) &&
                        variant.isActive &&
                        variant.stock > 0,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        disabled={!isAvailable}
                        aria-pressed={isSelected}
                        className={`
                          flex
                          h-11
                          items-center
                          justify-center
                          rounded-lg
                          border
                          text-sm
                          font-medium
                          transition-colors
                          duration-200
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[var(--brand)]
                          focus-visible:ring-offset-2
                          ${
                            isSelected
                              ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                              : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                          }
                          disabled:cursor-not-allowed
                          disabled:opacity-35
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* Availability                                                    */}
            {/* =============================================================== */}

            {selectedVariant && (
              <div className="mt-8 border-t border-[var(--border)] pt-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Availability
                  </p>

                  <p
                    className={`
                      text-sm
                      font-medium
                      ${
                        selectedVariant.stock > 0 && selectedVariant.isActive
                          ? "text-[var(--success)]"
                          : "text-[var(--error)]"
                      }
                    `}
                  >
                    {selectedVariant.stock > 0 && selectedVariant.isActive
                      ? selectedVariant.stock <= 5
                        ? `Only ${selectedVariant.stock} left`
                        : "In stock"
                      : "Out of stock"}
                  </p>
                </div>

                {selectedVariant.sku && (
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    SKU: {selectedVariant.sku}
                  </p>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* Quantity + Cart                                                 */}
            {/* =============================================================== */}

            <div className="mt-8 border-t border-[var(--border)] pt-7">
              <div className="flex gap-3">
                <div
                  className="
                    flex
                    h-12
                    shrink-0
                    items-center
                    rounded-lg
                    border
                    border-[var(--border)]
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity <= 1 || addCartItemMutation.isPending}
                    aria-label="Decrease quantity"
                    className="
                      flex
                      h-full
                      w-11
                      items-center
                      justify-center
                      text-[var(--text-secondary)]
                      transition-colors
                      duration-200
                      hover:text-[var(--brand)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--brand)]
                      focus-visible:ring-inset
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <Minus size={16} strokeWidth={1.8} />
                  </button>

                  <span className="w-8 text-center text-sm font-medium text-[var(--text-primary)]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(
                          selectedVariant?.stock ?? current,
                          current + 1,
                        ),
                      )
                    }
                    disabled={
                      !canIncreaseQuantity || addCartItemMutation.isPending
                    }
                    aria-label="Increase quantity"
                    className="
                      flex
                      h-full
                      w-11
                      items-center
                      justify-center
                      text-[var(--text-secondary)]
                      transition-colors
                      duration-200
                      hover:text-[var(--brand)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--brand)]
                      focus-visible:ring-inset
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <Plus size={16} strokeWidth={1.8} />
                  </button>
                </div>

                <Button
                  type="button"
                  size="lg"
                  rounded="md"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={
                    !canAddToCart ||
                    addCartItemMutation.isPending ||
                    isAuthLoading
                  }
                >
                  {addCartItemMutation.isPending
                    ? "Adding..."
                    : !canAddToCart
                      ? "Out of stock"
                      : "Add to cart"}
                </Button>
              </div>

              {addCartItemMutation.isSuccess && (
                <p className="mt-3 text-sm text-[var(--success)]">
                  Added to your cart.
                </p>
              )}

              {addCartItemMutation.isError && (
                <p className="mt-3 text-sm text-[var(--error)]">
                  Unable to add this item to your cart. Please try again.
                </p>
              )}
            </div>

            {/* =============================================================== */}
            {/* Delivery                                                        */}
            {/* =============================================================== */}

            {selectedVariant && (
              <div className="mt-8 border-t border-[var(--border)] pt-7">
                <div className="flex gap-3">
                  <Truck
                    size={18}
                    strokeWidth={1.8}
                    className="
                      mt-0.5
                      shrink-0
                      text-[var(--text-secondary)]
                    "
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Delivery & fulfillment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                      {getFulfillmentLabel(selectedVariant.fulfillmentType)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4 text-xs">
                      <span className="text-[var(--text-muted)]">
                        Shipping method
                      </span>

                      <span className="font-medium text-[var(--text-primary)]">
                        {getShippingLabel(selectedVariant.shippingType)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================== */}
        {/* Product Details                                                    */}
        {/* ================================================================== */}

        <section className="mt-20 border-t border-[var(--border)] pt-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--text-muted)]
                "
              >
                Product details
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-[var(--text-primary)]
                "
              >
                Everything you need to know
              </h2>
            </div>

            <div className="md:col-span-2">
              {product.description ? (
                <p className="whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  Product details are currently unavailable.
                </p>
              )}

              <div className="mt-8 border-y border-[var(--border)]">
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

        {/* ================================================================== */}
        {/* Reviews                                                            */}
        {/* ================================================================== */}

        {selectedVariant && <ReviewSection variantId={selectedVariant.id} />}

        {/* ================================================================== */}
        {/* Related Products                                                   */}
        {/* ================================================================== */}

        {relatedLoading ? (
          <section className="mt-24 border-t border-[var(--border)] pt-12">
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--text-muted)]
                "
              >
                More to explore
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-[var(--text-primary)]
                "
              >
                You may also like
              </h2>
            </div>

            <div className="mt-8">
              <ProductGridSkeleton count={4} />
            </div>
          </section>
        ) : relatedProducts.length > 0 ? (
          <section className="mt-24 border-t border-[var(--border)] pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--text-muted)]
                  "
                >
                  More to explore
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-tight
                    text-[var(--text-primary)]
                  "
                >
                  You may also like
                </h2>
              </div>

              <Link
                to="/products"
                className="
                  hidden
                  text-sm
                  font-medium
                  text-[var(--text-primary)]
                  underline-offset-4
                  transition-colors
                  duration-200
                  hover:text-[var(--brand)]
                  hover:underline
                  sm:block
                "
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
// DETAILS
// ============================================================================

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[var(--border)] py-4 last:border-b-0">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>

      <p className="text-right text-sm font-medium text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function getFulfillmentLabel(
  fulfillmentType: StorefrontDetailVariant["fulfillmentType"],
) {
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

function getShippingLabel(
  shippingType: StorefrontDetailVariant["shippingType"],
) {
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
// SKELETON
// ============================================================================

function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-[var(--surface)]" />

        <div className="grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:gap-16">
          <div className="aspect-square rounded-xl bg-[var(--surface)]" />

          <div className="py-1">
            <div className="h-3 w-24 rounded bg-[var(--surface)]" />

            <div className="mt-5 h-10 w-4/5 rounded bg-[var(--surface)]" />

            <div className="mt-4 h-4 w-40 rounded bg-[var(--surface)]" />

            <div className="mt-7 h-8 w-36 rounded bg-[var(--surface)]" />

            <div className="mt-8 border-t border-[var(--border)] pt-8">
              <div className="h-4 w-16 rounded bg-[var(--surface)]" />

              <div className="mt-4 flex gap-2">
                <div className="h-11 w-20 rounded-lg bg-[var(--surface)]" />
                <div className="h-11 w-20 rounded-lg bg-[var(--surface)]" />
                <div className="h-11 w-20 rounded-lg bg-[var(--surface)]" />
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-8">
              <div className="h-4 w-16 rounded bg-[var(--surface)]" />

              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="h-11 rounded-lg bg-[var(--surface)]" />
                <div className="h-11 rounded-lg bg-[var(--surface)]" />
                <div className="h-11 rounded-lg bg-[var(--surface)]" />
                <div className="h-11 rounded-lg bg-[var(--surface)]" />
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-8">
              <div className="h-12 w-full rounded-lg bg-[var(--surface)]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// NOT FOUND
// ============================================================================

function ProductNotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="text-center">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[var(--text-muted)]
          "
        >
          Product
        </p>

        <h1
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-tight
            text-[var(--text-primary)]
          "
        >
          Product not found
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          The product you're looking for doesn't exist or is no longer
          available.
        </p>

        <div className="mt-6">
          <Button
            onClick={() => navigate("/products")}
            size="md"
            rounded="full"
          >
            Continue shopping
          </Button>
        </div>
      </div>
    </main>
  );
}
