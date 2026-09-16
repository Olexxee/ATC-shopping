import { Heart, LogOut, MapPin, Package } from "lucide-react";
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
        <div className="py-10">
          <div className="mb-8">
            <p className="text-sm font-medium text-neutral-500">My Account</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
              Account
            </h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AccountCard
              icon={<Package size={22} />}
              title="Orders"
              description="View your orders and track their status."
              onClick={() => navigate("/orders")}
            />

            <AccountCard
              icon={<Heart size={22} />}
              title="Wishlist"
              description="View the products you've saved."
              onClick={() => navigate("/wishlist")}
            />

            <AccountCard
              icon={<MapPin size={22} />}
              title="Addresses"
              description="Manage your saved delivery addresses."
              onClick={() => navigate("/addresses")}
            />
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
            >
              <LogOut size={17} />
              Sign out
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
      className="group rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
        {icon}
      </div>

      <h2 className="mt-5 text-base font-semibold text-neutral-950">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-neutral-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-medium text-neutral-700">
        View →
      </span>
    </button>
  );
}
