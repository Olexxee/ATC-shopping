import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "../ui/Button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" rounded="full" aria-label="Search">
        <Search size={20} />
      </Button>

      <Button variant="ghost" size="icon" rounded="full" aria-label="Wishlist">
        <Heart size={20} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        rounded="full"
        aria-label="Shopping cart"
      >
        <ShoppingBag size={20} />
      </Button>

      <Button variant="ghost" size="icon" rounded="full" aria-label="Account">
        <User size={20} />
      </Button>
    </div>
  );
}
