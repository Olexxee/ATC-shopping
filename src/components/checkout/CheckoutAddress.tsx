import { Check, MapPin, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import type { Address } from "../../features/address/address.types";


interface CheckoutAddressProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelect: (addressId: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export default function CheckoutAddress({
  addresses,
  selectedAddressId,
  onSelect,
  isLoading,
  isError,
}: CheckoutAddressProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-700" />

            <h2 className="font-semibold text-gray-900">Delivery address</h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Where should we deliver your order?
          </p>
        </div>

        <Link
          to="/addresses"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gray-900 hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add address
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load your saved addresses.
        </div>
      ) : addresses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-400" />

          <h3 className="mt-3 font-semibold text-gray-900">
            No delivery address
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add an address before placing your order.
          </p>

          <Link
            to="/addresses"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add delivery address
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <div className="space-y-3">
            {addresses.map((address) => {
              const selected = address.id === selectedAddressId;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => onSelect(address.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {address.fullName}
                        </p>

                        {address.label && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {address.label}
                          </span>
                        )}

                        {address.isDefault && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        {address.addressLine}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {address.city}
                        {address.state ? `, ${address.state}` : ""}
                        {address.country ? `, ${address.country}` : ""}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {address.phone}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              to="/addresses"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              Manage addresses
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
