import { Search, ShoppingBag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useCurrentUser } from "../../features/auth/auth.queries";
import { useCart } from "../../features/cart/cart.queries";

export function CartButton() {
  const navigate = useNavigate();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const { data: cart } = useCart(!authLoading && Boolean(user));

  const totalItems = cart?.totalItems ?? 0;

  return (
    <button
      type="button"
      onClick={() => navigate("/cart")}
      aria-label={`Shopping cart${totalItems ? `, ${totalItems} items` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
    >
      <ShoppingBag size={20} />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-950 px-1 text-[10px] font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

export function HeaderActions() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        rounded="full"
        aria-label="Search"
        onClick={() => navigate("/search")}
      >
        <Search size={20} />
      </Button>

      <CartButton />

      <Button
        variant="ghost"
        size="icon"
        rounded="full"
        aria-label="Account"
        onClick={() => navigate("/account")}
      >
        <User size={20} />
      </Button>
    </div>
  );
}