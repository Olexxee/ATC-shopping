import { useEffect, useState } from "react";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../features/cart/cart.queries";
import { useCartStore } from "../../features/cart/cart.store";
import { useMyAddresses } from "../../features/address/address.queries";
import { useCheckout } from "../../features/checkout/checkout.mutations";
import CheckoutAddress from "../../components/checkout/CheckoutAddress";
import CheckoutNotes from "../../components/checkout/CheckoutNotes";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";


export default function CheckoutPage() {
  const navigate = useNavigate();

  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCart(true);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const {
    data: addresses = [],
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useMyAddresses();

  const checkoutMutation = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (serverCart) {
      setCart(serverCart);
    }
  }, [serverCart, setCart]);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) ?? addresses[0];

      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  const handlePlaceOrder = () => {
    if (!selectedAddressId || checkoutMutation.isPending) {
      return;
    }

    checkoutMutation.mutate(
      {
        addressId: selectedAddressId,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (response) => {
          navigate(`/orders/${response.data.id}`);
        },
      },
    );
  };

  if (isCartLoading && !cart) {
    return <CheckoutSkeleton />;
  }

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

        {checkoutMutation.isError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {checkoutMutation.error instanceof Error
              ? checkoutMutation.error.message
              : "Unable to create your order. Please try again."}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <CheckoutAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              isLoading={isAddressLoading}
              isError={isAddressError}
            />

            <CheckoutNotes value={notes} onChange={setNotes} />
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <CheckoutOrderSummary
              cart={cart}
              selectedAddress={selectedAddress}
              isSubmitting={checkoutMutation.isPending}
              onSubmit={handlePlaceOrder}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

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

        <h1 className="mt-5 text-xl font-bold text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <div className="mt-6">{action}</div>
      </div>
    </main>
  );
}
