import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { Address } from "../../features/address/address.types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: AddressCardProps) {
  return (
    <article
      className={`relative rounded-2xl border bg-white p-5 transition ${
        address.isDefault
          ? "border-gray-900 ring-1 ring-gray-900"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <MapPin className="h-5 w-5 text-gray-700" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {address.fullName}
              </h3>

              {address.label && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {address.label}
                </span>
              )}

              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-current" />
                  Default
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-1.5 pl-0 text-sm text-gray-600">
        <p>{address.addressLine}</p>

        <p>
          {address.city}
          {address.state ? `, ${address.state}` : ""}
        </p>

        <p>{address.country}</p>

        <p className="pt-1 font-medium text-gray-800">{address.phone}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            disabled={isSettingDefault}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star className="h-4 w-4" />
            {isSettingDefault ? "Setting..." : "Make default"}
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(address)}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
