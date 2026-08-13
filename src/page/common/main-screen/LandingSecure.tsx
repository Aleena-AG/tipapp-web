import {
  Lock,
  ShieldCheck,
  Shield,
} from "lucide-react";
import secureStripe from "@/assets/images/landing/secure-stripe.png";

const FEATURES = [
  {
    title: "Secure & Encrypted",
    description: "Bank-level security for every transaction.",
    Icon: Shield,
    iconBg: "bg-[#B3000C]",
  },
  {
    title: "Trusted by Millions",
    description: "Powered by Stripe, trusted globally.",
    Icon: ShieldCheck,
    iconBg: "bg-[#0B538D]",
  },
  {
    title: "Privacy First",
    description: "Your data is safe with us.",
    Icon: Lock,
    iconBg: "bg-[#B3000C]",
  },
] as const;

export const LandingSecure = () => {
  return (
    <section
      id="security"
      className="landing-secure relative scroll-mt-[88px] px-16 py-48 sm:px-24 lg:px-32 lg:py-64"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-40">
        <div className="ta-animate-fade text-left">
          <h2 className="max-w-[460px] text-[28px] leading-[1.15] tracking-tight text-[#1A1A2E] poppins-bold sm:text-[34px] lg:text-[40px]">
            Secure payments.
            <br />
            Simple tipping.
          </h2>
          <p className="mt-16 max-w-[480px] text-[14px] leading-relaxed text-[#5B6475] poppins-medium sm:text-[15px]">
            TipApp uses Stripe, a world-class secure payment gateway to keep
            your transactions safe, encrypted and private.
          </p>

          <div className="mt-36 grid gap-24 sm:grid-cols-3 sm:gap-20">
            {FEATURES.map(({ title, description, Icon, iconBg }) => (
              <div key={title} className="flex flex-col items-start">
                <span
                  className={`flex h-[44px] w-[44px] items-center justify-center rounded-full text-white ${iconBg}`}
                >
                  <Icon className="h-[19px] w-[19px]" strokeWidth={2.25} />
                </span>
                <p className="mt-14 text-[14px] leading-tight text-[#1A1A2E] poppins-bold">
                  {title}
                </p>
                <p className="mt-6 text-[12px] leading-snug text-[#5B6475] poppins-medium sm:text-[13px]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="ta-animate-slide-up mx-auto w-full lg:mx-0 lg:justify-self-end"
          style={{ animationDelay: "160ms" }}
        >
          <img
            src={secureStripe}
            alt="TipApp powered by Stripe with Visa, Mastercard, Apple Pay, American Express and Google Pay"
            className="landing-secure-art mx-auto h-auto w-full max-w-[540px] object-contain object-center select-none lg:max-w-[560px]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};
