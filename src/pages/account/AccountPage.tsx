import {
  ArrowRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  Search,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/layout/Container";
import { useAuthStore } from "../../features/auth/auth.store";

export default function AccountPage() {
  const navigate = useNavigate();
  const resetAuth = useAuthStore((state) => state.reset);

  const handleLogout = () => {
    resetAuth();
    navigate("/auth/login", { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <Container>
        <div className="py-10 sm:py-12">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-medium text-neutral-500">
              My Account
            </p>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                  Account
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                  Manage your orders, saved products, sourcing requests, and
                  delivery information.
                </p>
              </div>
            </div>
          </div>

          {/* Account options */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AccountCard
              icon={<Package size={21} />}
              title="Orders"
              description="View your orders and track their status."
              onClick={() => navigate("/orders")}
            />

            <AccountCard
              icon={<Search size={21} />}
              title="Sourcing Requests"
              description="Track products you've asked Keplex to find for you."
              onClick={() => navigate("/account/sourcing")}
            />

            <AccountCard
              icon={<WalletCards size={21} />}
              title="FlexPay"
              description="Manage your installment plans and make payments."
              onClick={() => navigate("/account/installments")}
            />

            <AccountCard
              icon={<Heart size={21} />}
              title="Wishlist"
              description="View the products you've saved."
              onClick={() => navigate("/wishlist")}
            />

            <AccountCard
              icon={<MapPin size={21} />}
              title="Addresses"
              description="Manage your saved delivery addresses."
              onClick={() => navigate("/addresses")}
            />
          </div>

          {/* Sign out */}
          <div className="mt-10 border-t border-neutral-200 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="group inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <LogOut
                size={17}
                className="transition-transform group-hover:-translate-x-0.5"
              />

              <span>Sign out</span>
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}

interface AccountCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function AccountCard({
  icon,
  title,
  description,
  onClick,
}: AccountCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
    >
      {/* Icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-colors duration-200 group-hover:bg-neutral-950 group-hover:text-white">
        {icon}
      </div>

      {/* Content */}
      <div className="mt-5 pr-8">
        <h2 className="text-base font-semibold text-neutral-950">
          {title}
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-neutral-500">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute right-5 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-all duration-200 group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
        <ArrowRight
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>

      {/* Bottom action */}
      <div className="mt-5 text-sm font-medium text-neutral-700">
        View details
      </div>
    </button>
  );
}
