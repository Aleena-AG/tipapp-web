import { Heart, Lock, ShieldCheck, Zap } from "lucide-react";
import imgWallet from "@/assets/images/landing/everyone/wallet-coins.png";

const TRUST_ITEMS = [
  {
    title: "100% Secure",
    description: "Your transactions are protected.",
    Icon: ShieldCheck,
    accentTitle: true,
  },
  {
    title: "Instant Transfer",
    description: "Tips are transferred in real time.",
    Icon: Zap,
  },
  {
    title: "Private & Safe",
    description: "Your data and privacy are our priority.",
    Icon: Lock,
  },
  {
    title: "Show Appreciation",
    description: "Small tips make a big difference.",
    Icon: Heart,
    fillIcon: true,
  },
] as const;

export const LandingIntro = () => {
  return (
    <section
      id="features"
      className="relative hidden scroll-mt-[88px] overflow-visible px-16 pb-36 pt-4 sm:px-24 sm:pb-48 sm:pt-8 lg:block lg:px-32 lg:pb-56"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div
        className="ta-animate-slide-up relative mx-auto max-w-[1180px] overflow-visible"
        style={{ animationDelay: "240ms" }}
      >
        <div className="relative flex flex-col overflow-visible rounded-[18px] border border-[#E8ECF1] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)] sm:rounded-[22px] md:flex-row md:items-stretch md:pr-[72px] lg:pr-[88px]">
          <div className="grid flex-1 grid-cols-1 divide-y divide-[#EEF1F5] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {TRUST_ITEMS.map((item) => {
              const { title, description, Icon } = item;
              const accentTitle = "accentTitle" in item && item.accentTitle;
              const fillIcon = "fillIcon" in item && item.fillIcon;

              return (
                <div
                  key={title}
                  className="flex items-start gap-10 px-14 py-16 sm:px-14 sm:py-20 lg:px-16"
                >
                  <span className="mt-1 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#FFE5E8] text-[#B3000C]">
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={2.25}
                      fill={fillIcon ? "currentColor" : "none"}
                    />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] leading-tight poppins-bold sm:text-[14px] ${
                        accentTitle ? "text-[#B3000C]" : "text-[#1A1A2E]"
                      }`}
                    >
                      {title}
                    </p>
                    <p className="mt-4 text-[11px] leading-snug text-[#5B6475] poppins-medium sm:text-[12px]">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute -right-[20px] top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-right-[36px]">
            <img
              src={imgWallet}
              alt=""
              aria-hidden
              className="h-[100px] w-[100px] -rotate-[-20deg] object-cover drop-shadow-[0_14px_28px_rgba(179,0,12,0.22)] lg:h-[160px] lg:w-[160px]"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
