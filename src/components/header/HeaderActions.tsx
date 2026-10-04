import { Search, ShoppingBag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/Button";
import { useCurrentUser } from "../../features/auth/auth.queries";
import { useCart } from "../../features/cart/cart.queries";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { data: user, isLoading: authLoading } = useCurrentUser();

  const { data: cart } = useCart(
    !authLoading && Boolean(user),
  );

  const totalItems = cart?.totalItems ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Shopping cart${totalItems ? `, ${totalItems} items` : ""}`}
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        text-[var(--text-secondary)]
        transition-colors
        duration-200
        hover:bg-[var(--surface)]
        hover:text-[var(--brand)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
      "
    >
      <ShoppingBag size={20} strokeWidth={1.8} />

      {totalItems > 0 && (
        <span
          className="
            absolute
            -right-0.5
            -top-0.5
            flex
            h-5
            min-w-5
            items-center
            justify-center
            rounded-full
            bg-[var(--brand)]
            px-1
            text-[10px]
            font-semibold
            leading-none
            text-white
          "
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

interface HeaderActionsProps {
  onCartClick: () => void;
}

export function HeaderActions({
  onCartClick,
}: HeaderActionsProps) {
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
        <Search size={20} strokeWidth={1.8} />
      </Button>

      <CartButton onClick={onCartClick} />

      <Button
        variant="ghost"
        size="icon"
        rounded="full"
        aria-label="Account"
        onClick={() => navigate("/account")}
      >
        <User size={20} strokeWidth={1.8} />
      </Button>
    </div>
  );
}
