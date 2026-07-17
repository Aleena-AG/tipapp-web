import React from "react";
import {
  Send,
  Heart,
  Crosshair,
  Users,
  Telescope,
  Briefcase,
  Shield,
  Bell,
  Wallet,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";

const BLUE = "#0B538D";
const RED = "#d71921";

const whatWeDoItems: { label: string; text: string; Icon: LucideIcon }[] = [
  {
    Icon: Send,
    label: "For Tippers:",
    text: "Send tips easily, securely, and instantly — no cash needed.",
  },
  {
    Icon: Heart,
    label: "For Service Providers & Creators:",
    text: "Receive direct appreciation from your audience or customers.",
  },
  {
    Icon: Briefcase,
    label: "For Businesses:",
    text: "Streamline digital tipping for staff with transparency and control.",
  },
];

const whyChooseItems: {
  title: string;
  description: string;
  Icon: LucideIcon;
  accent: "blue" | "red";
}[] = [
  {
    title: "Secure Payments",
    description: "Secure transactions with trusted payment gateways",
    Icon: Shield,
    accent: "blue",
  },
  {
    title: "Instant Notifications",
    description: "Instant notifications for every tip sent or received",
    Icon: Bell,
    accent: "blue",
  },
  {
    title: "Transparent System",
    description: "Transparent commission and payout system",
    Icon: Wallet,
    accent: "red",
  },
  {
    title: "Cross-Platform",
    description: "Works seamlessly on both mobile and web",
    Icon: MonitorSmartphone,
    accent: "blue",
  },
];

const BrandUnderline = ({ className = "" }: { className?: string }) => (
  <div className={`mx-auto flex h-[3px] w-[48px] overflow-hidden rounded-full ${className}`}>
    <span className="h-full w-1/2 bg-[#0B538D]" />
    <span className="h-full w-1/2 bg-[#d71921]" />
  </div>
);

const SectionCard: React.FC<{
  accent: "blue" | "red";
  Icon: LucideIcon;
  title: string;
  delayClass?: string;
  children: React.ReactNode;
}> = ({ accent, Icon, title, delayClass = "", children }) => {
  const isBlue = accent === "blue";
  return (
    <article
      className={`ta-animate-slide-up ${delayClass} flex gap-14 rounded-[14px] border border-[#E4EAF2] bg-card p-16 shadow-[0_6px_20px_rgba(11,83,141,0.07)] sm:gap-18 sm:p-20 dark:border-slate-700/80 dark:bg-slate-800/90 dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)] ${
        isBlue
          ? "border-l-[4px] border-l-[#0B538D]"
          : "border-l-[4px] border-l-[#d71921]"
      }`}
    >
      <div
        className={`mt-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full sm:h-[48px] sm:w-[48px] ${
          isBlue
            ? "bg-[#E8F2FA] dark:bg-[#0B538D]/30"
            : "bg-[#FDECED] dark:bg-[#d71921]/20"
        }`}
      >
        <Icon
          className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px]"
          style={{ color: isBlue ? BLUE : RED }}
          strokeWidth={2}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="poppins-semibold mb-8 text-[17px] text-[#0B2C4A] sm:mb-10 sm:text-[18px] dark:text-white">
          {title}
        </h2>
        {children}
      </div>
    </article>
  );
};

const AboutUs: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere pb-80 pt-80">
      <PageAmbientBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[820px] flex-col gap-20 px-20 sm:gap-24 sm:px-24">
        <header className="ta-animate-fade relative flex flex-col items-center gap-10 pt-6 text-center sm:pt-8">
          <div className="ta-float absolute left-0 top-4 hidden h-[40px] w-[40px] items-center justify-center rounded-full bg-card shadow-[0_4px_14px_rgba(11,83,141,0.12)] sm:flex lg:-left-4 dark:bg-slate-800 dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]">
            <Send className="h-[18px] w-[18px] text-[#0B538D] dark:text-[#93C5FD]" strokeWidth={2} />
          </div>
          <div
            className="ta-float absolute right-0 top-4 hidden h-[40px] w-[40px] items-center justify-center rounded-full bg-card shadow-[0_4px_14px_rgba(215,25,33,0.12)] sm:flex lg:-right-4 dark:bg-slate-800 dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
            style={{ animationDelay: "1.2s" }}
          >
            <Heart className="h-[18px] w-[18px] text-[#d71921]" strokeWidth={2} />
          </div>

          <div className="flex flex-col items-center gap-8">
            <h1 className="poppins-semibold text-[28px] leading-none tracking-tight sm:text-[34px]">
              <span className="text-[#0B2C4A] dark:text-white">About </span>
              <span className="text-[#0B538D] dark:text-[#60A5FA]">Tip</span>
              <span className="text-[#d71921]">Tapp</span>
            </h1>
            <BrandUnderline className="ta-animate-slide-up ta-delay-1" />
            <p className="poppins-regular ta-animate-slide-up ta-delay-1 max-w-[520px] text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400">
              Welcome to TipTapp — the simplest way to show appreciation and support
              through digital tipping.
            </p>
          </div>
        </header>

        <SectionCard accent="blue" Icon={Crosshair} title="Our Mission" delayClass="ta-delay-2">
          <div className="flex flex-col gap-8">
            <p className="poppins-regular text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400">
              Our mission is to make gratitude effortless. Whether you’re thanking
              your favorite creator, a service provider, or a coworker, TipTapp lets
              you send and receive tips securely with just a few taps.
            </p>
            <p className="poppins-regular text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400">
              We believe in rewarding effort instantly and empowering individuals to
              earn directly from their supporters.{" "}
              <span className="poppins-semibold text-[#0B538D] dark:text-[#93C5FD]">
                Every tip, no matter the size, helps people feel valued for their
                time, talent, and service.
              </span>
            </p>
          </div>
        </SectionCard>

        <SectionCard accent="red" Icon={Users} title="What We Do" delayClass="ta-delay-3">
          <ul className="flex flex-col gap-10">
            {whatWeDoItems.map(({ Icon, label, text }) => (
              <li
                key={label}
                className="poppins-regular flex items-start gap-10 text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400"
              >
                <span className="mt-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#FDECED] dark:bg-[#d71921]/20">
                  <Icon className="h-[13px] w-[13px] text-[#d71921]" strokeWidth={2} />
                </span>
                <span>
                  <span className="poppins-semibold text-[#0B2C4A] dark:text-white">{label}</span>{" "}
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard accent="blue" Icon={Telescope} title="Our Vision" delayClass="ta-delay-4">
          <h3 className="poppins-semibold mb-6 text-[14px] text-[#3B7BB5] dark:text-[#93C5FD]">
            The Beginning
          </h3>
          <p className="poppins-regular text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400">
            To create a world where appreciation moves faster than words — where
            gratitude is shared instantly, globally, and meaningfully. Thank you for
            being part of the TipTapp community. Together, we’re changing the way
            people say “thank you.”
          </p>
        </SectionCard>

        <section className="ta-animate-slide-up ta-delay-5 mt-4 flex flex-col gap-20">
          <div className="flex flex-col items-center gap-8 text-center">
            <h2 className="poppins-semibold text-[22px] text-[#0B2C4A] sm:text-[24px] dark:text-white">
              Why Choose TipTapp
            </h2>
            <BrandUnderline />
          </div>

          <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseItems.map(({ title, description, Icon, accent }, index) => {
              const isBlue = accent === "blue";
              return (
                <div
                  key={title}
                  className={`ta-animate-pop group flex flex-col items-center gap-8 rounded-[12px] border border-[#E4EAF2] bg-card px-12 pb-14 pt-16 text-center shadow-[0_6px_18px_rgba(11,83,141,0.06)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_10px_24px_rgba(11,83,141,0.1)] dark:border-slate-700/80 dark:bg-slate-800/90 dark:shadow-[0_6px_18px_rgba(0,0,0,0.3)] dark:hover:border-slate-600 ${
                    index === 0
                      ? "ta-delay-5"
                      : index === 1
                        ? "ta-delay-6"
                        : "ta-delay-7"
                  }`}
                >
                  <div
                    className={`flex h-[44px] w-[44px] items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
                      isBlue
                        ? "bg-[#E8F2FA] dark:bg-[#0B538D]/30"
                        : "bg-[#FDECED] dark:bg-[#d71921]/20"
                    }`}
                  >
                    <Icon
                      className="h-[20px] w-[20px]"
                      style={{ color: isBlue ? BLUE : RED }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="poppins-semibold text-[13px] text-[#0B2C4A] sm:text-[14px] dark:text-white">
                    {title}
                  </h3>
                  <p className="poppins-regular text-[11px] leading-[16px] text-[#6B7A8A] sm:text-[12px] sm:leading-[17px] dark:text-slate-400">
                    {description}
                  </p>
                  <span
                    className={`mt-auto h-[3px] w-[28px] rounded-full ${
                      isBlue ? "bg-[#0B538D]" : "bg-[#d71921]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
