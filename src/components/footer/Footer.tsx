import { Link } from "react-router-dom";
import type { ComponentType, ReactNode } from "react";
import { Globe, MessageCircle, Music2 } from "lucide-react";
import { Container } from "../layout/Container";
import { useStorefrontConfig } from "../../features/businessConfig/businessConfig.queries";

// ============================================================================
// NAVIGATION
// ============================================================================

interface FooterLink {
  label: string;
  to: string;
}

const shopLinks: FooterLink[] = [
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Brands", to: "/brands" },
  { label: "New arrivals", to: "/products?sort=newest" },
];

const informationLinks: FooterLink[] = [
  { label: "About us", to: "/about" },
  { label: "Importation", to: "/importation" },
  { label: "How it works", to: "/how-it-works" },
];

const supportLinks: FooterLink[] = [
  { label: "Contact us", to: "/contact" },
  { label: "Shipping", to: "/shipping" },
  { label: "Returns", to: "/returns" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

const DEFAULT_DESCRIPTION =
  "Discover products from around the world, or let us help you source what you need.";

// ============================================================================
// SOCIAL ICONS
// lucide-react no longer ships brand icons, so these are inline SVGs.
// ============================================================================

type SocialIcon = ComponentType<{ size?: number; className?: string }>;

interface SvgProps {
  size?: number;
  className?: string;
}

function StrokeSvg({
  size = 16,
  className,
  children,
}: SvgProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const InstagramIcon: SocialIcon = (props) => (
  <StrokeSvg {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </StrokeSvg>
);

const FacebookIcon: SocialIcon = (props) => (
  <StrokeSvg {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </StrokeSvg>
);

const YoutubeIcon: SocialIcon = (props) => (
  <StrokeSvg {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </StrokeSvg>
);

const LinkedinIcon: SocialIcon = (props) => (
  <StrokeSvg {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </StrokeSvg>
);

const XIcon: SocialIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const socialIconMap: Record<string, SocialIcon> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: XIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  tiktok: Music2,
  whatsapp: MessageCircle,
  website: Globe,
};

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function formatPlatformLabel(platform: string): string {
  const key = platform.toLowerCase();
  if (key === "x" || key === "twitter") return "X (Twitter)";
  if (key === "tiktok") return "TikTok";
  if (key === "youtube") return "YouTube";
  if (key === "linkedin") return "LinkedIn";
  if (key === "whatsapp") return "WhatsApp";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

// ============================================================================
// FOOTER
// ============================================================================

export function Footer() {
  const { data: config } = useStorefrontConfig();

  const companyName = config?.companyName?.trim() || "Keplex";

  const phone = config?.phone?.trim();
  const email = config?.email?.trim();
  const address = config?.address?.trim();

  const socials = Object.entries(config?.socialLinks ?? {}).flatMap(
    ([platform, url]) => {
      if (typeof url !== "string") return [];
      const href = normalizeUrl(url);
      if (!href) return [];

      return [
        {
          platform,
          href,
          Icon: socialIconMap[platform.toLowerCase()] ?? Globe,
        },
      ];
    },
  );

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
          {/* Brand */}
          <div className="col-span-2 max-w-sm md:col-span-1">
            {config?.logo ? (
              <Link to="/" className="inline-block">
                <img
                  src={config.logo}
                  alt={companyName}
                  className="h-8 w-auto"
                />
              </Link>
            ) : (
              <Link
                to="/"
                className="text-xl font-bold tracking-tight text-neutral-950"
              >
                {companyName}
              </Link>
            )}

            <p className="mt-4 text-sm leading-6 text-neutral-500">
              {DEFAULT_DESCRIPTION}
            </p>

            {(phone || email || address) && (
              <div className="mt-5 space-y-1.5 text-sm text-neutral-500">
                {phone && (
                  <p>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="transition-colors hover:text-neutral-950"
                    >
                      {phone}
                    </a>
                  </p>
                )}

                {email && (
                  <p>
                    <a
                      href={`mailto:${email}`}
                      className="break-all transition-colors hover:text-neutral-950"
                    >
                      {email}
                    </a>
                  </p>
                )}

                {address && <p className="whitespace-pre-line">{address}</p>}
              </div>
            )}

            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap items-center gap-3">
                {socials.map(({ platform, href, Icon }) => (
                  <li key={platform}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={formatPlatformLabel(platform)}
                      title={formatPlatformLabel(platform)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Information" links={informationLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral-200 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>

          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-neutral-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

// ============================================================================
// COLUMN
// ============================================================================

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>

      <nav aria-label={title} className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="w-fit text-sm text-neutral-500 transition-colors hover:text-neutral-950"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}