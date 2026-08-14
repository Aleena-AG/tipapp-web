import { useCallback, useEffect, useRef, useState } from "react";
import {
  Car,
  ChevronRight,
  Heart,
  Hotel,
  Luggage,
  Package,
  Plane,
  Scissors,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  SprayCan,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import imgDrivers from "@/assets/images/landing/everyone/drivers.png";
import imgDelivery from "@/assets/images/landing/everyone/delivery.png";
import imgSalon from "@/assets/images/landing/everyone/salon.png";
import imgHealthcare from "@/assets/images/landing/everyone/healthcare.png";
import imgCabin from "@/assets/images/landing/everyone/cabin-crew.png";
import imgSecurity from "@/assets/images/landing/everyone/security.png";
import imgWaiters from "@/assets/images/landing/everyone/waiters.png";
import imgHotel from "@/assets/images/landing/everyone/hotel.png";
import imgShopStaff from "@/assets/images/landing/everyone/shop-staff.png";
import imgCleaners from "@/assets/images/landing/everyone/cleaners.png";
import imgPorter from "@/assets/images/landing/everyone/porter.png";

type Profession = {
  id: string;
  title: string;
  description: string;
  image: string;
  Icon: LucideIcon;
  accent: string;
};

const CardWave = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 220 20"
    preserveAspectRatio="none"
    className="block h-[20px] w-full"
    aria-hidden
  >
    <path
      d="M0 20 V11 C48 11 48 3 110 3 C172 3 172 11 220 11 V20 H0 Z"
      fill={color}
    />
  </svg>
);

const PROFESSIONS: Profession[] = [
  {
    id: "drivers",
    title: "Drivers",
    description: "Every ride deserves a tip.",
    image: imgDrivers,
    Icon: Car,
    accent: "#E85D04",
  },
  {
    id: "delivery",
    title: "Delivery Partners",
    description: "Reward the hustle, every drop.",
    image: imgDelivery,
    Icon: Package,
    accent: "#0B538D",
  },
  {
    id: "salon",
    title: "Salon Professionals",
    description: "Style that earns appreciation.",
    image: imgSalon,
    Icon: Scissors,
    accent: "#DB2777",
  },
  {
    id: "healthcare",
    title: "Healthcare Heroes",
    description: "Care that deserves a thank you.",
    image: imgHealthcare,
    Icon: Heart,
    accent: "#2563EB",
  },
  {
    id: "cabin",
    title: "Cabin Crew",
    description: "Fly high with gratitude.",
    image: imgCabin,
    Icon: Plane,
    accent: "#B3000C",
  },
  {
    id: "security",
    title: "Security Guards",
    description: "Safety that deserves thanks.",
    image: imgSecurity,
    Icon: Shield,
    accent: "#1E3A5F",
  },
  {
    id: "waiters",
    title: "Waiters",
    description: "Great service, quick tip.",
    image: imgWaiters,
    Icon: UtensilsCrossed,
    accent: "#0D9488",
  },
  {
    id: "hotel",
    title: "Hotel Staff",
    description: "Hospitality that shines.",
    image: imgHotel,
    Icon: Hotel,
    accent: "#4338CA",
  },
  {
    id: "porter",
    title: "Porter",
    description: "Every bag handled with care.",
    image: imgPorter,
    Icon: Luggage,
    accent: "#1E40AF",
  },
  {
    id: "shop-staff",
    title: "Shop Staff",
    description: "Every great experience counts.",
    image: imgShopStaff,
    Icon: ShoppingCart,
    accent: "#16A34A",
  },
  {
    id: "cleaners",
    title: "Cleaners",
    description: "Clean spaces deserve thanks.",
    image: imgCleaners,
    Icon: SprayCan,
    accent: "#0284C7",
  },
];



const FLOATERS = [
  { emoji: "❤️", className: "landing-everyone-floater-1", size: "text-[20px] sm:text-[26px]" },
  { emoji: "🪙", className: "landing-everyone-floater-2", size: "text-[18px] sm:text-[24px]" },
  { emoji: "✨", className: "landing-everyone-floater-3", size: "text-[16px] sm:text-[20px]" },
  { emoji: "❤️", className: "landing-everyone-floater-4", size: "text-[14px] sm:text-[18px]" },
  { emoji: "🪙", className: "landing-everyone-floater-5", size: "text-[16px] sm:text-[22px]" },
  { emoji: "✨", className: "landing-everyone-floater-6", size: "text-[14px] sm:text-[18px]" },
] as const;

const SLIDE_COUNT = PROFESSIONS.length;

const getCardScrollLeft = (track: HTMLDivElement, card: HTMLElement) =>
  card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;

export const LandingEveryone = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollIndexRef = useRef(0);
  const isResettingRef = useRef(false);
  const pausedRef = useRef(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(SLIDE_COUNT / 4));

  scrollIndexRef.current = scrollIndex;

  const scrollToIndex = useCallback((index: number, instant = false) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;

    const left = Math.max(0, getCardScrollLeft(track, card));

    if (instant) {
      isResettingRef.current = true;
      track.classList.remove("scroll-smooth");
      track.scrollTo({ left, behavior: "auto" });
      scrollIndexRef.current = index;
      setScrollIndex(index);
      setPage(Math.min(pageCount - 1, Math.floor(index / 4)));
      window.setTimeout(() => {
        track.classList.add("scroll-smooth");
        isResettingRef.current = false;
      }, 50);
      return;
    }

    track.scrollTo({ left, behavior: "smooth" });
    scrollIndexRef.current = index;
    setScrollIndex(index);
    setPage(Math.min(pageCount - 1, Math.floor(index / 4)));
  }, [pageCount]);

  const scrollToIndexRef = useRef(scrollToIndex);
  scrollToIndexRef.current = scrollToIndex;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (isResettingRef.current) return;

      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      scrollIndexRef.current = closest;
      setScrollIndex(closest);
      setPage(Math.min(pageCount - 1, Math.floor(closest / 4)));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [pageCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const pause = () => {
      pausedRef.current = true;
    };
    const resumeHover = () => {
      pausedRef.current = false;
    };
    const resumeTouch = () => {
      window.setTimeout(() => {
        pausedRef.current = false;
      }, 4000);
    };

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resumeHover);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", resumeTouch, { passive: true });

    const timer = window.setInterval(() => {
      if (pausedRef.current || isResettingRef.current) return;

      const current = scrollIndexRef.current;
      if (current >= SLIDE_COUNT - 1) {
        scrollToIndexRef.current(0, true);
      } else {
        scrollToIndexRef.current(current + 1, false);
      }
    }, 2500);

    return () => {
      window.clearInterval(timer);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resumeHover);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", resumeTouch);
    };
  }, []);

  return (
    <section
      id="everyone"
      className="landing-everyone relative scroll-mt-[72px] overflow-x-hidden px-0 py-40 sm:scroll-mt-[88px] sm:px-24 sm:py-48 lg:px-32 lg:py-64"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {FLOATERS.map((f) => (
          <span
            key={f.className}
            className={`landing-floater ${f.className} ${f.size} absolute select-none drop-shadow-sm`}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-16 sm:px-0">
        <div className="ta-animate-fade text-center">
          <h2 className="relative inline-block text-[24px] leading-tight tracking-tight poppins-bold sm:text-[34px] lg:text-[40px]">
            <Sparkles
              className="absolute -left-28 -top-6 hidden h-18 w-18 text-[#B3000C] sm:block"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-[#B3000C]">TipApp</span>{" "}
            <span className="text-[#1A1A2E]">is for Everyone</span>
            <Sparkles
              className="absolute -right-28 -top-4 hidden h-16 w-16 text-[#B3000C] sm:block"
              strokeWidth={2}
              aria-hidden
            />
          </h2>
          <p className="mx-auto mt-12 max-w-[420px] px-4 text-[13px] leading-relaxed text-[#5B6475] poppins-medium sm:px-0 sm:text-[15px]">
            Send tips instantly to show your appreciation.
          </p>

          <div className="mx-auto mt-20 flex max-w-[560px] flex-col gap-12 sm:mt-24 sm:flex-row sm:justify-center">
            <div className="flex flex-1 items-center gap-12 rounded-[14px] border border-[#E4E7EE] bg-white px-14 py-12 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:px-16 sm:py-14">
              <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] text-[#0B538D]">
                <ShieldCheck className="h-[20px] w-[20px]" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-[14px] text-[#1A1A2E] poppins-bold">
                  Instant & Secure
                </p>
                <p className="mt-2 text-[12px] text-[#5B6475] poppins-medium">
                  Safe payments, always.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-12 rounded-[14px] border border-[#E4E7EE] bg-white px-14 py-12 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:px-16 sm:py-14">
              <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FFE5E8] text-[#B3000C]">
                <Heart className="h-[18px] w-[18px]" strokeWidth={2.25} fill="currentColor" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-[14px] text-[#1A1A2E] poppins-bold">For Everyone</p>
                <p className="mt-2 text-[12px] text-[#5B6475] poppins-medium">
                  Any service, any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-32 w-full sm:mt-40 lg:mt-48">
        <div className="mx-auto max-w-[1400px] sm:px-24 lg:px-32">
            <div
              ref={trackRef}
              className="landing-everyone-track flex w-full items-center snap-x snap-mandatory gap-12 overflow-x-auto scroll-smooth px-16 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-4 lg:gap-[16px] lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {PROFESSIONS.map((item, i) => {
                const isActive = i === scrollIndex;
                const { Icon } = item;
                return (
                  <div
                    key={item.id}
                    className="landing-everyone-card-wrap shrink-0 snap-center px-1 py-10"
                  >
                    <article
                      onClick={() => scrollToIndex(i, false)}
                      className={`landing-everyone-card group relative w-full cursor-pointer overflow-hidden rounded-[20px] bg-white transition-all duration-300 ${
                        isActive
                          ? "z-10 scale-[1.07] border-2 border-[#B3000C] shadow-[0_18px_40px_rgba(179,0,12,0.14)] lg:scale-100"
                          : "scale-100 border-2 border-transparent"
                      }`}
                      style={{ animationDelay: `${80 + i * 60}ms` }}
                    >
                    <div className="relative shrink-0">
                      <div className="relative h-[240px] w-full overflow-hidden sm:h-[300px]">
                        <img
                          src={item.image}
                          alt={`${item.title} accepting tips with TipApp`}
                          className="absolute inset-0 h-full w-full scale-[1.12] object-cover object-[center_16%]"
                          draggable={false}
                        />
                        <div className="absolute inset-x-0 bottom-0 z-[1] leading-[0]">
                          <CardWave color={item.accent} />
                        </div>
                      </div>
                      <span
                        className="absolute bottom-0 left-1/2 z-20 flex h-[46px] w-[46px] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full ring-4 ring-white"
                        style={{ backgroundColor: item.accent }}
                      >
                        <Icon className="h-[19px] w-[19px] text-white" strokeWidth={2.25} />
                      </span>
                    </div>

                    <div className="flex min-h-[140px] flex-col items-center bg-white px-14 pb-20 pt-20 text-center sm:min-h-[148px] sm:pt-22">
                      <h3 className="text-[16px] leading-snug text-[#1A1A2E] poppins-bold sm:text-[17px]">
                        {item.title}
                      </h3>
                      <p className="mt-6 max-w-[180px] text-[11px] leading-relaxed text-[#6B7280] poppins-medium sm:text-[12px]">
                        {item.description}
                      </p>
                      <span
                        className="mt-auto inline-flex items-center gap-4 pt-10 text-[12px] poppins-semibold transition-opacity group-hover:opacity-80"
                        style={{ color: item.accent }}
                      >
                        Learn more
                        <ChevronRight className="h-[13px] w-[13px]" strokeWidth={2.5} />
                      </span>
                    </div>
                  </article>
                  </div>
                );
              })}
            </div>

          <div className="mt-16 flex items-center justify-center gap-8">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                onClick={() => scrollToIndex(Math.min(SLIDE_COUNT - 1, i * 4), false)}
                className={`h-[8px] rounded-full transition-all ${
                  page === i
                    ? "w-[22px] bg-[#B3000C]"
                    : "w-[8px] bg-[#D5DAE3] hover:bg-[#B8C0CE]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
