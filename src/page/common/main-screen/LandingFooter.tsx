import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import appLogo from "@/assets/images/appLogo.png";
import footerMascot from "@/assets/images/landing/footer-mascot.png";
import qrCode from "@/assets/svg/QRCode.svg";
import { APP_STORE_URL } from "@/utils/constants/FooterData";

const QUICK_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Everyone", href: "#everyone" },
  { label: "Features", href: "#features" },

] as const;

const COMPANY_LINKS = [
  { label: "About Us", href: "/about-us", route: true },
  { label: "Contact Us", href: "/contact-us", route: true },
  { label: "Blog", href: "/view-more/newsletter", route: true },
  { label: "Careers", href: "/contact-us", route: true },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/policy", route: true },
  { label: "Terms of Service", href: "/policy", route: true },
  { label: "Refund Policy", href: "/policy", route: true },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: Instagram,
  },
  {
    label: "X",
    href: "https://x.com/",
    Icon: XIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    Icon: TikTokIcon,
  },
] as const;

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function FooterLink({
  href,
  label,
  route = false,
}: {
  href: string;
  label: string;
  route?: boolean;
}) {
  const className =
    "text-[13px] text-[#5B6475] transition-colors hover:text-[#B3000C] poppins-medium";

  if (route) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

function StoreBadge({
  href,
  top,
  bottom,
  glyph,
  comingSoon = false,
}: {
  href?: string;
  top: string;
  bottom: string;
  glyph: ReactNode;
  comingSoon?: boolean;
}) {
  const className =
    "flex h-[44px] w-full min-w-[168px] items-center gap-10 rounded-[10px] bg-[#1A1A2E] px-14 text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]";
  const content = (
    <>
      {glyph}
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] text-white/70 poppins-medium">{top}</span>
        <span className="mt-2 text-[14px] poppins-semibold">{bottom}</span>
      </span>
    </>
  );

  if (comingSoon) {
    return (
      <div
        className={`${className} cursor-default opacity-70`}
        aria-label={`${top} ${bottom}`}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className} transition hover:-translate-y-0.5 hover:bg-[#0F0F18]`}
    >
      {content}
    </a>
  );
}

const AppleGlyph = () => (
  <svg width="18" height="22" viewBox="0 0 19 23" fill="none" aria-hidden>
    <path
      d="M9.17 6.37C8.3 6.37 6.94 5.38 5.51 5.41C3.63 5.44 1.9 6.5.93 8.2-1.03 11.59.43 16.61 2.33 19.37C3.27 20.71 4.37 22.22 5.84 22.18C7.24 22.12 7.77 21.26 9.47 21.26C11.17 21.26 11.65 22.18 13.13 22.14C14.65 22.12 15.61 20.77 16.53 19.42C17.6 17.86 18.04 16.34 18.07 16.26C18.03 16.25 15.13 15.13 15.09 11.77C15.07 8.96 17.38 7.62 17.49 7.56C16.17 5.63 14.14 5.41 13.43 5.36C11.59 5.22 10.04 6.37 9.17 6.37ZM12.29 3.54C13.07 2.6 13.59 1.3 13.45 0C12.33.05 10.99.74 10.18 1.68C9.46 2.51 8.84 3.84 9 5.11C10.24 5.21 11.51 4.48 12.29 3.54Z"
      fill="white"
    />
  </svg>
);

const PlayGlyph = () => (
  <svg width="18" height="20" viewBox="0 0 24 26" fill="none" aria-hidden>
    <path d="M1.6.6C1.3.9 1.1 1.4 1.1 2v22c0 .6.2 1.1.5 1.4L13.4 13 1.6.6z" fill="#34D399" />
    <path d="M18.1 8.7 4.5.9C4.2.7 3.9.6 3.6.6L15.1 12l3-3.3z" fill="#60A5FA" />
    <path d="M18.1 17.3l-3-3.3L3.6 25.4c.3 0 .6-.1.9-.3l13.6-7.8z" fill="#F87171" />
    <path d="M18.1 8.7 15.1 12l3 3.3 4-2.3c.9-.5.9-1.7 0-2.2l-4-2.1z" fill="#FBBF24" />
  </svg>
);

export const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      {/* CTA banner */}
      <div className="landing-footer-cta relative overflow-hidden bg-[#B3000C] px-16 py-36 sm:px-24 lg:px-32 lg:py-44">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[120px] opacity-30 sm:w-[180px]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[120px] opacity-30 sm:w-[180px]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-28 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-32">
          <div className="text-center lg:text-left">
            <h2 className="mx-auto max-w-[360px] text-[24px] leading-tight text-white poppins-bold sm:text-[32px] lg:mx-0 lg:text-[36px]">
              Ready to Tip or Get Tipped?
            </h2>
            <p className="mx-auto mt-12 max-w-[340px] text-[13px] leading-relaxed text-white/85 poppins-medium sm:text-[15px] lg:mx-0">
              Join thousands of users making every service more rewarding.
            </p>
          </div>

          <div className="flex flex-col items-center gap-16 sm:flex-row sm:justify-center sm:gap-20 lg:gap-24">
            <img
              src={footerMascot}
              alt="TipApp wallet mascot"
              className="h-[160px] w-auto object-contain sm:h-[240px] lg:h-[280px]"
              draggable={false}
            />

            <div className="flex items-center gap-14 sm:gap-16">
              <div className="relative flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[14px] bg-white p-10 shadow-[0_12px_28px_rgba(0,0,0,0.2)] sm:h-[124px] sm:w-[124px]">
                <img
                  src={qrCode}
                  alt="QR code to download TipApp"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
                <span className="absolute flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#B3000C] text-[10px] text-white">
                  ♥
                </span>
              </div>

              <p className="hidden max-w-[120px] text-[14px] leading-snug text-white poppins-semibold sm:block">
                Scan to download TipApp
                <span className="mt-6 block text-[22px] leading-none opacity-80">↗</span>
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[280px] flex-col gap-10 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center lg:min-w-[180px] lg:flex-col">
            <StoreBadge
              href={APP_STORE_URL}
              top="Download on the"
              bottom="App Store"
              glyph={<AppleGlyph />}
            />
            <StoreBadge
              top="Google Play"
              bottom="Coming Soon"
              glyph={<PlayGlyph />}
              comingSoon
            />
          </div>
        </div>
      </div>

      {/* Links footer */}
      <div className="bg-white px-16 py-40 sm:px-24 lg:px-32 lg:py-48">
        <div className="mx-auto grid max-w-[1180px] gap-32 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-24">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-12">
              <img
                src={appLogo}
                alt="TipApp"
                className="h-[52px] w-[52px] rounded-[12px] object-cover shadow-[0_4px_14px_rgba(158,42,43,0.2)]"
              />
              <span className="text-[15px] text-[#1A1A2E] poppins-semibold">
                the tipping app
              </span>
            </div>
            <p className="mt-14 max-w-[240px] text-[13px] leading-relaxed text-[#5B6475] poppins-medium">
              Making gratitude simple, instant and meaningful.
            </p>
          </div>

          <div>
            <p className="text-[14px] text-[#1A1A2E] poppins-bold">Quick Links</p>
            <ul className="mt-16 flex flex-col gap-12">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href} label={label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] text-[#1A1A2E] poppins-bold">Company</p>
            <ul className="mt-16 flex flex-col gap-12">
              {COMPANY_LINKS.map(({ label, href, route }) => (
                <li key={label}>
                  <FooterLink href={href} label={label} route={route} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] text-[#1A1A2E] poppins-bold">Legal</p>
            <ul className="mt-16 flex flex-col gap-12">
              {LEGAL_LINKS.map(({ label, href, route }) => (
                <li key={label}>
                  <FooterLink href={href} label={label} route={route} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] text-[#1A1A2E] poppins-bold">Follow Us</p>
            <div className="mt-16 flex items-center gap-10">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#1A1A2E] text-white transition hover:bg-[#B3000C]"
                >
                  <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-36 max-w-[1180px] border-t border-[#E8ECF1] pt-24 text-center text-[12px] text-[#5B6475] poppins-medium sm:text-left">
          © {new Date().getFullYear()} TipApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
