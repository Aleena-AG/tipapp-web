import { useEffect, useState } from "react";
import {
  Bell,
  Heart,
  Sparkles,
  Star,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import heroTipScan from "@/assets/images/landing/hero-tip-scan.png";

type FeatureCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const LEFT_CONTENT: FeatureCard[] = [
  {
    title: "Instant Tip",
    body: "Scan a QR and send tips in seconds — no cash, no fuss.",
    Icon: Zap,
    iconBg: "bg-[#EDE5FF]",
    iconColor: "text-[#7C3AED]",
  },
  {
    title: "Real-time Alerts",
    body: "Get notified the moment a tip is sent or received.",
    Icon: Bell,
    iconBg: "bg-[#FFE5E8]",
    iconColor: "text-[#E11D2E]",
  },
  {
    title: "Spread Love",
    body: "Show appreciation with tips that feel personal.",
    Icon: Heart,
    iconBg: "bg-[#FFE8F0]",
    iconColor: "text-[#DB2777]",
  },
];

const RIGHT_CONTENT: FeatureCard[] = [
  {
    title: "Secure Wallet",
    body: "Private, encrypted payments you can trust every time.",
    Icon: Wallet,
    iconBg: "bg-[#EDE5FF]",
    iconColor: "text-[#7C3AED]",
  },
  {
    title: "Rate & Appreciate",
    body: "Leave a rating so great service gets recognized.",
    Icon: Star,
    iconBg: "bg-[#FFF4D6]",
    iconColor: "text-[#CA8A04]",
  },
  {
    title: "Fast & Easy",
    body: "Simple steps from scan to tip — built for everyday.",
    Icon: Sparkles,
    iconBg: "bg-[#E8F1FF]",
    iconColor: "text-[#2563EB]",
  },
];

const FLOATERS = [
  { emoji: "❤️", className: "landing-floater landing-floater-1", size: "text-[22px] sm:text-[28px]" },
  { emoji: "⭐", className: "landing-floater landing-floater-2", size: "text-[18px] sm:text-[24px]" },
  { emoji: "💕", className: "landing-floater landing-floater-3", size: "text-[16px] sm:text-[22px]" },
  { emoji: "✨", className: "landing-floater landing-floater-4", size: "text-[20px] sm:text-[26px]" },
  { emoji: "❤️", className: "landing-floater landing-floater-5", size: "text-[14px] sm:text-[20px]" },
  { emoji: "⭐", className: "landing-floater landing-floater-6", size: "text-[16px] sm:text-[22px]" },
  { emoji: "💫", className: "landing-floater landing-floater-7", size: "text-[18px] sm:text-[24px]" },
  { emoji: "💖", className: "landing-floater landing-floater-8", size: "text-[15px] sm:text-[20px]" },
] as const;

function ContentCard({
  card,
  side,
  index,
}: {
  card: FeatureCard;
  side: "left" | "right";
  index: number;
}) {
  const { Icon } = card;
  return (
    <article
      className={`landing-hero-card flex items-start gap-10 rounded-[16px] border border-white/80 bg-white/90 px-12 py-11 shadow-[0_8px_28px_rgba(40,40,80,0.08)] backdrop-blur-sm ${
        side === "left" ? "landing-card-from-left" : "landing-card-from-right"
      }`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <span
        className={`mt-1 flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] ${card.iconBg} ${card.iconColor}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <h3 className="text-[14px] leading-tight text-[#1A1A2E] poppins-bold sm:text-[15px]">
          {card.title}
        </h3>
        <p className="mt-3 text-[12px] leading-snug text-[#5B6475] poppins-medium sm:text-[12.5px]">
          {card.body}
        </p>
      </div>
    </article>
  );
}

type ToastPhase = "hidden" | "in" | "out";

function TipNotifyCards() {
  const [sent, setSent] = useState<ToastPhase>("hidden");
  const [recv, setRecv] = useState<ToastPhase>("hidden");

  useEffect(() => {
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    let cancelled = false;

    const runCycle = async () => {
      while (!cancelled) {
        // Idle before cards appear
        await wait(2800);
        if (cancelled) break;

        // Sent first
        setSent("in");
        await wait(1600);
        if (cancelled) break;

        // Received second
        setRecv("in");
        await wait(4200);
        if (cancelled) break;

        // Remove one by one
        setSent("out");
        await wait(700);
        if (cancelled) break;
        setSent("hidden");

        await wait(500);
        if (cancelled) break;
        setRecv("out");
        await wait(700);
        if (cancelled) break;
        setRecv("hidden");

        // Pause before next cycle (~few moments)
        await wait(8000);
      }
    };

    void runCycle();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[8] hidden lg:block"
      aria-hidden
    >
      {sent !== "hidden" && (
        <div
          className={`landing-tip-toast absolute left-[33%] top-[48%] xl:left-[35%] xl:top-[46%] ${
            sent === "in" ? "landing-tip-toast-in" : "landing-tip-toast-out"
          }`}
        >
          <div className="landing-tip-toast-float flex max-w-[240px] items-center gap-8 rounded-[14px] border border-white/90 bg-white px-10 py-8 shadow-[0_10px_28px_rgba(40,40,80,0.14)]">
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] text-[16px]">
              🎉
            </span>
            <p className="text-[12px] leading-snug text-[#1A1A2E] poppins-semibold">
              You just sent a tip!{" "}
              <span className="poppins-medium text-[#5B6475]">Thank you!</span>
            </p>
          </div>
        </div>
      )}

      {recv !== "hidden" && (
        <div
          className={`landing-tip-toast absolute right-[31%] top-[46%] xl:right-[33%] xl:top-[44%] ${
            recv === "in" ? "landing-tip-toast-in" : "landing-tip-toast-out"
          }`}
        >
          <div className="landing-tip-toast-float flex max-w-[220px] items-center gap-8 rounded-[14px] border border-white/90 bg-white px-10 py-8 shadow-[0_10px_28px_rgba(40,40,80,0.14)]">
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FFE5E8] text-[16px]">
              🎉
            </span>
            <div className="min-w-0">
              <p className="text-[12px] leading-tight text-[#1A1A2E] poppins-semibold">
                Tip Received!
              </p>
              <p className="mt-1 text-[15px] leading-none text-[#16A34A] poppins-bold">
                + $5.00
              </p>
              <p className="mt-2 text-[11px] leading-tight text-[#5B6475] poppins-medium">
                Thank you so much!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const LandingHero = () => {
  return (
    <section
      className="landing-hero relative min-h-[calc(100dvh-72px)] w-full overflow-hidden lg:min-h-[calc(100dvh-80px)]"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="pointer-events-none absolute inset-x-[160px] inset-y-0 hidden items-center justify-center translate-y-[10%] lg:flex xl:inset-x-[200px] xl:translate-y-[12%]">
        <img
          src={heroTipScan}
          alt=""
          aria-hidden
          className="h-full w-full max-h-[78%] max-w-[980px] object-contain object-center select-none"
          width={1024}
          height={602}
          draggable={false}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center translate-y-[8%] lg:hidden">
        <img
          src={heroTipScan}
          alt=""
          aria-hidden
          className="h-[62%] w-full max-w-[640px] object-contain object-center opacity-90 select-none"
          width={1024}
          height={602}
          draggable={false}
        />
      </div>

      <TipNotifyCards />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {FLOATERS.map((f) => (
          <span
            key={f.className}
            className={`${f.className} ${f.size} absolute select-none drop-shadow-sm`}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-[1440px] flex-col px-12 pb-16 pt-28 sm:px-20 sm:pt-32 lg:min-h-[calc(100dvh-80px)] lg:px-20 lg:pt-36 xl:px-28">
        <div className="relative z-20 ta-animate-fade pb-10 text-center lg:pb-14">
          <h1 className="text-[28px] leading-tight tracking-tight text-[#1A1A2E] poppins-bold sm:text-[36px] lg:text-[42px]">
          <span className="text-[#10447c]">Give Tips.</span> <span className="text-[#B3000C]">Get Tipped.</span> All in one place.
          </h1>
          <p className="mx-auto mt-10 max-w-[420px] text-[14px] leading-relaxed text-[#5B6475] poppins-medium sm:text-[15px]">
            The simple way to get paid for great service and get tipped by your customers.
          </p>
          <button
            type="button"
            className="landing-download-btn ta-animate-pop relative z-20 mt-16 inline-flex min-h-[52px] items-center justify-center gap-8 rounded-[14px] bg-[#B3000C] px-28 py-14 text-[16px] poppins-semibold text-white shadow-[0_12px_32px_rgba(179,0,12,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#99000A] hover:shadow-[0_16px_36px_rgba(179,0,12,0.42)] sm:min-h-[56px] sm:px-36 sm:text-[17px]"
            style={{ animationDelay: "280ms" }}
          >
            Download App
          </button>
        </div>

        <div className="relative z-10 mt-8 grid flex-1 grid-cols-1 items-center gap-14 lg:mt-4 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[250px_minmax(0,1fr)_250px]">
          <div className="flex flex-col gap-12 self-center">
            {LEFT_CONTENT.map((card, i) => (
              <ContentCard key={card.title} card={card} side="left" index={i} />
            ))}
          </div>

          {/* Center spacer — keeps side cards clear of illustration */}
          <div className="hidden min-h-[80px] lg:block" aria-hidden />

          <div className="flex flex-col gap-12 self-center">
            {RIGHT_CONTENT.map((card, i) => (
              <ContentCard
                key={card.title}
                card={card}
                side="right"
                index={i + 3}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
