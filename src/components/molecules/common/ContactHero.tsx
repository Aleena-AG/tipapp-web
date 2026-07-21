import React from "react";
import {
  Mail,
  MessageCircle,
  Headphones,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const BrandUnderline = () => (
  <div className="mx-auto flex h-[3px] w-[48px] overflow-hidden rounded-full">
    <span className="h-full w-1/2 bg-[#0B538D]" />
    <span className="h-full w-1/2 bg-[#d71921]" />
  </div>
);

const highlights: {
  title: string;
  text: string;
  Icon: LucideIcon;
  accent: "blue" | "red";
}[] = [
  {
    Icon: Mail,
    title: "Email support",
    text: "Reach us anytime — we reply as soon as we can.",
    accent: "blue",
  },
  {
    Icon: MessageCircle,
    title: "Account help",
    text: "Tips, withdrawals, and profile questions welcome.",
    accent: "blue",
  },
  {
    Icon: Headphones,
    title: "Tippers & providers",
    text: "Support for both sides of TipTapp.",
    accent: "red",
  },
];

const ContactHero: React.FC = () => {
  return (
    <div className="ta-animate-fade flex flex-col gap-20">
      <header className="flex flex-col items-center gap-10 text-center">
        <span className="ta-animate-pop rounded-full bg-[#E8F2FA] px-12 py-5 text-[11px] poppins-medium text-[#0B538D] sm:text-[12px] dark:bg-[#0B538D]/30 dark:text-[#93C5FD]">
          We&apos;re here to help
        </span>
        <h1 className="poppins-semibold text-[28px] leading-none text-[#0B2C4A] sm:text-[34px] dark:text-white">
          Contact Us
        </h1>
        <BrandUnderline />
        <p className="poppins-regular ta-animate-slide-up ta-delay-1 max-w-[520px] text-[13px] leading-[20px] text-[#5A6A7A] sm:text-[14px] sm:leading-[22px] dark:text-slate-400">
          Questions about tipping, withdrawals, or your account? We’re here to
          help. Our team supports both Service Providers and Tippers across web
          and mobile.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-14 sm:grid-cols-3">
        {highlights.map(({ title, text, Icon, accent }, index) => {
          const isBlue = accent === "blue";
          return (
            <div
              key={title}
              className={`ta-animate-pop group flex flex-col items-center gap-10 rounded-[14px] border bg-card px-14 py-18 text-center shadow-[0_6px_18px_rgba(11,83,141,0.06)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_10px_24px_rgba(11,83,141,0.1)] dark:bg-slate-800/90 dark:shadow-[0_6px_18px_rgba(0,0,0,0.3)] dark:hover:border-slate-600 ${
                isBlue
                  ? "border-[#D6E6F3] dark:border-slate-700/80"
                  : "border-[#F0CDD0] dark:border-red-900/40"
              } ${
                index === 0
                  ? "ta-delay-2"
                  : index === 1
                    ? "ta-delay-3"
                    : "ta-delay-4"
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
                  style={{ color: isBlue ? "#0B538D" : "#d71921" }}
                  strokeWidth={2}
                />
              </div>
              <h3 className="poppins-semibold text-[14px] text-[#0B2C4A] dark:text-white">
                {title}
              </h3>
              <p className="poppins-regular text-[12px] leading-[17px] text-[#6B7A8A] dark:text-slate-400">
                {text}
              </p>
              <span
                className={`mt-auto flex h-[28px] w-[28px] items-center justify-center rounded-full ${
                  isBlue ? "bg-[#0B538D]" : "bg-[#d71921]"
                }`}
              >
                <ArrowRight className="h-[14px] w-[14px] text-white" strokeWidth={2.5} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactHero;
