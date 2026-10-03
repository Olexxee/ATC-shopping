import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../features/cart/cart.queries";
import { useCartStore } from "../../features/cart/cart.store";
import { useMyAddresses } from "../../features/address/address.queries";

import {
  useCheckout,
  useCreateFlexPayPlan,
  useInitializeFlexPayPayment,
} from "../../features/checkout/checkout.mutations";

import { calculateFlexPayPlan } from "../../features/checkout/checkout.flexpay";

import type { Cart } from "../../features/cart/cart.types";

import CheckoutAddress from "../../components/checkout/CheckoutAddress";
import CheckoutNotes from "../../components/checkout/CheckoutNotes";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";
import FlexPayConfirmationModal from "../../components/checkout/FlexPayConfirmationModal";

type PaymentMode = "FULL" | "FLEXPAY";

const FLEXPAY_MAX_SUBTOTAL = 200_000;

const INSTALLMENT_OPTIONS = [
  { count: 2, intervalDays: 14, label: "2 payments" },
  { count: 3, intervalDays: 14, label: "3 payments" },
  { count: 4, intervalDays: 14, label: "4 payments" },
  { count: 6, intervalDays: 14, label: "6 payments" },
  { count: 8, intervalDays: 14, label: "8 payments" },
  { count: 12, intervalDays: 30, label: "12 payments" },
];

export default function CheckoutPage() {
  // ============================================================
  // CART
  // ============================================================

  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCart(true);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  // ============================================================
  // ADDRESS
  // ============================================================

  const {
    data: addresses = [],
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useMyAddresses();

  // ============================================================
  // MUTATIONS
  // ============================================================

  const checkoutMutation = useCheckout();
  const createFlexPayPlanMutation = useCreateFlexPayPlan();
  const initializeFlexPayPaymentMutation =
    useInitializeFlexPayPayment();

  // ============================================================
  // STATE
  // ============================================================

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("FULL");

  const [selectedCartItemIds, setSelectedCartItemIds] = useState<
    string[]
  >([]);

  const [installmentCount, setInstallmentCount] = useState(3);
  const [installmentIntervalDays, setInstallmentIntervalDays] =
    useState(14);

  const [showFlexPayConfirmation, setShowFlexPayConfirmation] =
    useState(false);

  const [paymentError, setPaymentError] = useState("");

  // ============================================================
  // SYNC SERVER CART -> STORE
  // ============================================================

  useEffect(() => {
    if (serverCart) {
      setCart(serverCart);
    }
  }, [serverCart, setCart]);

  // ============================================================
  // FLEXPAY ITEM SELECTION
  // ============================================================

  useEffect(() => {
    if (!cart) {
      return;
    }

    setSelectedCartItemIds((current) => {
      const availableIds = new Set(
        cart.items.map((item) => item.id),
      );

      // Initial cart load:
      // select all cart items for FlexPay.
      if (current.length === 0) {
        return cart.items.map((item) => item.id);
      }

      // Keep only selections that still exist in the cart.
      return current.filter((id) => availableIds.has(id));
    });
  }, [cart]);

  // ============================================================
  // DEFAULT ADDRESS
  // ============================================================

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) ??
        addresses[0];

      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  // ============================================================
  // SELECTED FLEXPAY ITEMS
  // ============================================================

  const selectedItems = useMemo(() => {
    if (!cart || selectedCartItemIds.length === 0) {
      return [];
    }

    const selectedIds = new Set(selectedCartItemIds);

    return cart.items.filter((item) => selectedIds.has(item.id));
  }, [cart, selectedCartItemIds]);

  // ============================================================
  // FLEXPAY SUBTOTAL
  //
  // FlexPay uses the price snapshot stored on each cart item.
  // This represents the price that will be locked when the
  // FlexPay plan is created.
  //
  // Do NOT use cart.subtotal here because the customer may
  // select only some of the cart items for FlexPay.
  // ============================================================


const flexPaySubtotal = useMemo(() => {
  if (selectedItems.length === 0) {
    return 0;
  }

  return selectedItems.reduce((total, item) => {
    const lineTotal = Number(item.lineTotal ?? 0);

    if (!Number.isFinite(lineTotal) || lineTotal < 0) {
      return total;
    }

    return total + lineTotal;
  }, 0);
}, [selectedItems]);

  const flexPayItemCount = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0);
  }, [selectedItems]);

  const canContinueFlexPay =
    selectedCartItemIds.length > 0 &&
    flexPaySubtotal > 0 &&
    flexPaySubtotal < FLEXPAY_MAX_SUBTOTAL;

  // ============================================================
  // FLEXPAY CALCULATION
  //
  // This is a frontend preview only.
  // The backend remains authoritative.
  // ============================================================

  const flexPayCalculation = useMemo(() => {
    if (
      paymentMode !== "FLEXPAY" ||
      flexPaySubtotal <= 0
    ) {
      return null;
    }

    return calculateFlexPayPlan({
      subtotal: flexPaySubtotal,
      installmentCount,
      installmentIntervalDays,
    });
  }, [
    paymentMode,
    flexPaySubtotal,
    installmentCount,
    installmentIntervalDays,
  ]);

  const firstPaymentAmount =
    flexPayCalculation?.firstPaymentAmount ?? 0;

  // ============================================================
  // SUBMITTING
  // ============================================================

  const isSubmitting =
    checkoutMutation.isPending ||
    createFlexPayPlanMutation.isPending ||
    initializeFlexPayPaymentMutation.isPending;

  // ============================================================
  // PAYMENT MODE
  // ============================================================

  const handlePaymentModeChange = (mode: PaymentMode) => {
    setPaymentError("");
    setPaymentMode(mode);
  };

  // ============================================================
  // FLEXPAY ITEM TOGGLE
  // ============================================================

  const handleToggleCartItem = (cartItemId: string) => {
    setPaymentError("");

    setSelectedCartItemIds((current) => {
      if (current.includes(cartItemId)) {
        return current.filter((id) => id !== cartItemId);
      }

      return [...current, cartItemId];
    });
  };

  // ============================================================
  // INSTALLMENT OPTION
  // ============================================================

  const handleInstallmentOptionChange = (
    count: number,
    intervalDays: number,
  ) => {
    setPaymentError("");
    setInstallmentCount(count);
    setInstallmentIntervalDays(intervalDays);
  };

  // ============================================================
  // PLACE ORDER / START FLEXPAY
  // ============================================================

  const handlePlaceOrder = () => {
    setPaymentError("");

    if (!selectedAddressId) {
      setPaymentError(
        "Please select a delivery address before continuing.",
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    // ----------------------------------------------------------
    // NORMAL CHECKOUT
    // ----------------------------------------------------------

    if (paymentMode === "FULL") {
      handleFullPayment();
      return;
    }

    // ----------------------------------------------------------
    // FLEXPAY VALIDATION
    // ----------------------------------------------------------

    if (selectedCartItemIds.length === 0) {
      setPaymentError(
        "Select at least one product for FlexPay.",
      );
      return;
    }

    if (flexPaySubtotal <= 0) {
      setPaymentError(
        "Unable to calculate the FlexPay plan.",
      );
      return;
    }

    if (flexPaySubtotal > FLEXPAY_MAX_SUBTOTAL) {
      setPaymentError(
        "FlexPay is currently available for merchandise totals below ₦200,000.",
      );
      return;
    }

    if (!flexPayCalculation) {
      setPaymentError(
        "Unable to calculate the FlexPay plan.",
      );
      return;
    }

    // Do not create the plan yet.
    // Show the confirmation step first.
    setShowFlexPayConfirmation(true);
  };

  // ============================================================
  // NORMAL FULL PAYMENT
  // ============================================================

  const handleFullPayment = () => {
    checkoutMutation.mutate(
      {
        addressId: selectedAddressId,
        notes: notes.trim() || undefined,
        paymentProvider: "PAYSTACK",
      },
      {
        onSuccess: (response) => {
          const payment = response.data.payment;

          if (!payment.authorizationUrl) {
            setPaymentError(
              "Payment authorization URL was not returned.",
            );
            return;
          }

          window.location.assign(payment.authorizationUrl);
        },

        onError: (error) => {
          setPaymentError(
            error instanceof Error
              ? error.message
              : "Unable to create your order. Please try again.",
          );
        },
      },
    );
  };

  // ============================================================
  // CONFIRM FLEXPAY
  // ============================================================

  const handleConfirmFlexPay = () => {
    if (!flexPayCalculation) {
      setPaymentError(
        "Unable to calculate the FlexPay plan.",
      );
      return;
    }

    if (selectedCartItemIds.length === 0) {
      setPaymentError(
        "Select at least one product for FlexPay.",
      );
      setShowFlexPayConfirmation(false);
      return;
    }

    setPaymentError("");

    createFlexPayPlanMutation.mutate(
      {
        sourceType: "CART",
        cartItemIds: selectedCartItemIds,
        addressId: selectedAddressId,
        installmentCount,
        installmentIntervalDays,
      },
      {
        onSuccess: (response) => {
          const plan = response.data;

          const initialAmount = Number(
            plan.installments?.[0]?.amount ?? 0,
          );

          if (
            !Number.isFinite(initialAmount) ||
            initialAmount <= 0
          ) {
            setPaymentError(
              "The initial FlexPay payment amount is invalid.",
            );
            return;
          }

          initializeFlexPayPaymentMutation.mutate(
            {
              planId: plan.id,
              payload: {
                amount: initialAmount,
              },
            },
            {
              onSuccess: (paymentResponse) => {
                const payment = paymentResponse.data;

                if (!payment.authorizationUrl) {
                  setPaymentError(
                    "Payment authorization URL was not returned.",
                  );
                  return;
                }

                window.location.assign(
                  payment.authorizationUrl,
                );
              },

              onError: (error) => {
                setPaymentError(
                  error instanceof Error
                    ? error.message
                    : "Unable to initialize the FlexPay payment.",
                );
              },
            },
          );
        },

        onError: (error) => {
          setPaymentError(
            error instanceof Error
              ? error.message
              : "Unable to create your FlexPay plan.",
          );
        },
      },
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isCartLoading && !cart) {
    return <CheckoutSkeleton />;
  }

  // ============================================================
  // CART ERROR
  // ============================================================

  if (isCartError && !cart) {
    return (
      <CheckoutMessage
        title="Unable to load your cart"
        message="We couldn't retrieve your cart. Please return to your cart and try again."
        action={
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
        }
      />
    );
  }

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!cart || cart.items.length === 0) {
    return (
      <CheckoutMessage
        title="Your cart is empty"
        message="Add some products to your cart before checking out."
        action={
          <Link
            to="/products"
            className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        }
      />
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white">
                <Lock className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Checkout
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Review your order and delivery details.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {paymentError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {paymentError}
            </div>
          )}

          {/* CONTENT */}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <CheckoutAddress
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                isLoading={isAddressLoading}
                isError={isAddressError}
              />

              <CheckoutNotes
                value={notes}
                onChange={setNotes}
              />

              <PaymentMethodCard
                paymentMode={paymentMode}
                onChange={handlePaymentModeChange}
              />

              {paymentMode === "FLEXPAY" && (
                <FlexPayConfiguration
                  cart={cart}
                  selectedCartItemIds={selectedCartItemIds}
                  onToggleItem={handleToggleCartItem}
                  installmentCount={installmentCount}
                  installmentIntervalDays={
                    installmentIntervalDays
                  }
                  onInstallmentChange={
                    handleInstallmentOptionChange
                  }
                  subtotal={flexPaySubtotal}
                  firstPaymentAmount={firstPaymentAmount}
                />
              )}
            </div>

            {/* ORDER SUMMARY */}

            <aside className="lg:sticky lg:top-6 lg:self-start">
            <CheckoutOrderSummary
  cart={cart}
  selectedAddress={selectedAddress}
  paymentMode={paymentMode}
  isSubmitting={isSubmitting}
  onSubmit={handlePlaceOrder}
  flexPaySubtotal={flexPaySubtotal}
  flexPayItemCount={flexPayItemCount}
  canContinueFlexPay={canContinueFlexPay}
/>
            </aside>
          </div>
        </div>
      </main>

      {/* FLEXPAY CONFIRMATION */}

      {showFlexPayConfirmation && flexPayCalculation && (
        <FlexPayConfirmationModal
          calculation={flexPayCalculation}
          onCancel={() => {
            if (!isSubmitting) {
              setShowFlexPayConfirmation(false);
            }
          }}
          onConfirm={handleConfirmFlexPay}
          isSubmitting={
            createFlexPayPlanMutation.isPending ||
            initializeFlexPayPaymentMutation.isPending
          }
        />
      )}
    </>
  );
}

// ============================================================
// PAYMENT METHOD
// ============================================================

interface PaymentMethodCardProps {
  paymentMode: PaymentMode;
  onChange: (mode: PaymentMode) => void;
}

function PaymentMethodCard({
  paymentMode,
  onChange,
}: PaymentMethodCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Payment method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose whether to pay in full or use Keplex FlexPay.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <PaymentMethodOption
          selected={paymentMode === "FULL"}
          onClick={() => onChange("FULL")}
          title="Pay in full"
          description="Pay the entire order now with Paystack."
        />

        <PaymentMethodOption
          selected={paymentMode === "FLEXPAY"}
          onClick={() => onChange("FLEXPAY")}
          title="Keplex FlexPay"
          description="Split the product cost into scheduled payments. Shipping is calculated when the products are fully paid."
        />
      </div>
    </section>
  );
}

// ============================================================
// FLEXPAY CONFIGURATION
// ============================================================

interface FlexPayConfigurationProps {
  cart: Cart;
  selectedCartItemIds: string[];
  onToggleItem: (cartItemId: string) => void;
  installmentCount: number;
  installmentIntervalDays: number;
  onInstallmentChange: (
    count: number,
    intervalDays: number,
  ) => void;
  subtotal: number;
  firstPaymentAmount: number;
}

function FlexPayConfiguration({
  cart,
  selectedCartItemIds,
  onToggleItem,
  installmentCount,
  installmentIntervalDays,
  onInstallmentChange,
  subtotal,
  firstPaymentAmount,
}: FlexPayConfigurationProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <CalendarDays className="h-5 w-5 text-gray-700" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900">
            FlexPay plan
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Select the products you want to put on FlexPay and
            choose your payment schedule.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900">
          Products in this plan
        </h3>

        <div className="mt-3 space-y-2">
          {cart.items.map((item) => {
            const selected = selectedCartItemIds.includes(item.id);

            const productName =
              item.variant?.product?.name ?? "Product";

            const variantLabel = [
              item.variant?.color,
              item.variant?.size,
            ]
              .filter(Boolean)
              .join(" / ");

            const itemPrice =
              Number(item.unitPriceSnapshot) * item.quantity;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleItem(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                {/* CHECKBOX */}

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    selected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </span>

                {/* PRODUCT */}

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {productName}
                  </span>

                  <span className="mt-0.5 block text-xs text-gray-500">
                    {variantLabel
                      ? `${variantLabel} · Qty ${item.quantity}`
                      : `Qty ${item.quantity}`}
                  </span>
                </span>

                {/* PRICE */}

                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  ₦
                  {itemPrice.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SCHEDULE */}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900">
          Payment schedule
        </h3>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {INSTALLMENT_OPTIONS.map((option) => {
            const selected =
              installmentCount === option.count &&
              installmentIntervalDays === option.intervalDays;

            return (
              <button
                key={`${option.count}-${option.intervalDays}`}
                type="button"
                onClick={() =>
                  onInstallmentChange(
                    option.count,
                    option.intervalDays,
                  )
                }
                className={`rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {option.label}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Every{" "}
                  {option.intervalDays === 30
                    ? "30 days"
                    : `${option.intervalDays} days`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUMMARY */}

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">
            Product subtotal
          </span>

          <span className="font-semibold text-gray-900">
            ₦
            {subtotal.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">
            First payment
          </span>

          <span className="font-semibold text-gray-900">
            ₦
            {firstPaymentAmount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          Product prices are locked when the plan is created.
          Shipping is calculated separately after the product
          balance has been fully paid.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// PAYMENT OPTION
// ============================================================

interface PaymentMethodOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

function PaymentMethodOption({
  selected,
  onClick,
  title,
  description,
}: PaymentMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
          : "border-gray-200 bg-white hover:border-gray-400"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-gray-900"
              : "border-gray-300"
          }`}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
          )}
        </span>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

// ============================================================
// SKELETON
// ============================================================

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-gray-200" />

          <div className="mt-5 h-9 w-40 rounded bg-gray-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="h-40 rounded-2xl bg-gray-200" />
            </div>

            <div className="h-[500px] rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// MESSAGE
// ============================================================

function CheckoutMessage({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <ShoppingBag className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>

        <div className="mt-6">{action}</div>
      </div>
    </main>
  );
}
    function handleFullPayment() {
      throw new Error("Function not implemented.");
    }

