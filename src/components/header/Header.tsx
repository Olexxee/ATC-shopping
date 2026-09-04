import { useState } from "react";
import { Container } from "../layout/Container";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { Navigation } from "./Navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden lg:block">
            <Navigation />
          </div>

          <div className="flex items-center">
            <div className="hidden sm:block">
              <HeaderActions />
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
