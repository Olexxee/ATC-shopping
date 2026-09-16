import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "../layout/Container";
import { CartButton, HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { Navigation } from "./Navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden lg:block">
            <Navigation />
          </div>

          <div className="flex items-center">
            {/* Desktop header actions */}
            <div className="hidden sm:block">
              <HeaderActions />
            </div>

            {/* Mobile header actions */}
            <div className="flex items-center gap-1 sm:hidden">
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

            <div className="lg:hidden">
              <MobileMenuButton
                open={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((current) => !current)}
              />
            </div>
          </div>
        </div>
      </Container>

      <MobileNavigation open={mobileMenuOpen} />
    </header>
  );
}
