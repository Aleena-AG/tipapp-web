import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MenuIcon, X } from "lucide-react";
import appLogo from "@/assets/images/appLogo.png";
import { handleScrollTop } from "@/hooks/hooks";

const LANDING_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Security", href: "#security" },
 
] as const;

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (window.location.pathname !== "/") {
      navigate({ pathname: "/", hash: id });
    }
  };

  const handleGetStarted = () => {
    setMobileOpen(false);
    navigate("/sign-up");
    handleScrollTop();
  };

  return (
    <header
      className={`landing-navbar sticky top-0 z-50 w-full border-b border-transparent ${
        scrolled ? "shadow-[0_1px_0_rgba(15,23,42,0.04)]" : ""
      }`}
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between gap-16 px-16 sm:px-24 lg:min-h-[80px] lg:px-32">
        <button
          type="button"
          onClick={() => {
            navigate("/");
            handleScrollTop();
          }}
          className="landing-nav-logo ta-animate-fade shrink-0 rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[#9E2A2B]/40"
          aria-label="Tip App home"
        >
          <img
            src={appLogo}
            alt="Tip App"
            className="landing-nav-logo-img h-[52px] w-[52px] rounded-[12px] object-cover shadow-[0_4px_14px_rgba(158,42,43,0.25)] sm:h-[58px] sm:w-[58px] lg:h-[64px] lg:w-[64px]"
          />
        </button>

        <nav
          className="hidden flex-1 items-center justify-center md:flex"
          aria-label="Landing"
        >
          <ul className="flex items-center gap-20 lg:gap-28">
            {LANDING_LINKS.map((link, i) => (
              <li
                key={link.href}
                className="ta-animate-fade"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="landing-nav-link group relative poppins-semibold text-[14px] text-[#1A1A2E] transition-colors duration-200 hover:text-[#9E2A2B] lg:text-[15px]"
                >
                  {link.label}
                  <span className="absolute -bottom-4 left-0 h-[2px] w-0 rounded-full bg-[#9E2A2B] transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-10">
          <button
            type="button"
            onClick={handleGetStarted}
            className="landing-nav-cta ta-animate-pop hidden rounded-[10px] bg-[#B3000C] px-18 py-10 text-[14px] poppins-semibold text-white shadow-[0_6px_18px_rgba(179,0,12,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#99000A] hover:shadow-[0_10px_24px_rgba(179,0,12,0.35)] active:translate-y-0 md:inline-flex lg:px-22 lg:py-11 lg:text-[15px]"
            style={{ animationDelay: "420ms" }}
          >
            Get Started
          </button>

          <button
            type="button"
            className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#EDEFF3] text-[#1A1A2E] transition-colors hover:bg-[#E2E5EB] md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-black/[0.06] transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "var(--landing-bg)" }}
      >
        <nav
          className="flex flex-col gap-4 px-16 py-14 sm:px-24"
          aria-label="Mobile landing"
        >
          {LANDING_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollToSection(link.href)}
              className="rounded-[10px] px-14 py-12 text-left text-[15px] poppins-semibold text-[#1A1A2E] transition-colors hover:bg-white hover:text-[#9E2A2B]"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleGetStarted}
            className="mt-6 rounded-[10px] bg-[#B3000C] px-16 py-12 text-[15px] poppins-semibold text-white shadow-[0_6px_18px_rgba(179,0,12,0.28)] transition-colors hover:bg-[#99000A]"
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
};
