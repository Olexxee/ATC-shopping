import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";


interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ open, onClick }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      rounded="full"
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );
}
