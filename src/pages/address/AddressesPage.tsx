import { useState } from "react";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AddressCard from "../../components/address/AddressCard";
import AddressForm from "../../components/address/AddressForm";
import {
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "../../features/address/address.mutations";
import { useMyAddresses } from "../../features/address/address.queries";
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../../features/address/address.types";



const MAX_ADDRESSES = 3;

export default function AddressesPage() {
  const { data: addresses = [], isLoading, isError, error } = useMyAddresses();

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const defaultMutation = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = (
    payload: CreateAddressPayload | UpdateAddressPayload,
  ) => {
    if (editingAddress) {
      updateMutation.mutate(
        {
          id: editingAddress.id,
          payload,
        },
        {
          onSuccess: handleCloseForm,
        },
      );

      return;
    }

    createMutation.mutate(payload as CreateAddressPayload, {
      onSuccess: handleCloseForm,
    });
  };

  const handleDelete = (address: Address) => {
    const confirmed = window.confirm(
      `Delete the address for ${address.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(address.id);
  };

  const handleSetDefault = (address: Address) => {
    defaultMutation.mutate(address.id);
  };

  const mutationError =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error ||
    defaultMutation.error;

  const mutationErrorMessage =
    mutationError instanceof Error ? mutationError.message : null;

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-semibold text-red-900">
              Unable to load your addresses
            </h1>

            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Please try again later."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const canAddAddress = addresses.length < MAX_ADDRESSES;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  My addresses
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your delivery addresses.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAddAddress}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Plus className="h-4 w-4" />
            Add address
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Saved addresses</span>

            <span className="text-sm font-semibold text-gray-900">
              {addresses.length} / {MAX_ADDRESSES}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900 transition-all"
              style={{
                width: `${(addresses.length / MAX_ADDRESSES) * 100}%`,
              }}
            />
          </div>
        </div>

        {mutationErrorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {mutationErrorMessage}
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <MapPin className="h-6 w-6 text-gray-500" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No saved addresses
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Add a delivery address so you can complete checkout quickly.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Add your first address
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === address.id
                }
                isSettingDefault={
                  defaultMutation.isPending &&
                  defaultMutation.variables === address.id
                }
              />
            ))}
          </div>
        )}

        {showForm && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            isSubmitting={isFormSubmitting}
          />
        )}
      </div>
    </main>
  );
}

function AddressesSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 h-10 w-64 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 h-16 animate-pulse rounded-xl bg-white" />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    </main>
  );
}
