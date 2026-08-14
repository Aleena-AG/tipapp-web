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
      <div className="mx-auto grid max-w-[1180px] items-center gap-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-40">
        <div className="ta-animate-fade text-center sm:text-left">
          <h2 className="mx-auto max-w-[460px] text-[26px] leading-[1.15] tracking-tight text-[#1A1A2E] poppins-bold sm:mx-0 sm:text-[34px] lg:text-[40px]">
            Secure payments.
            <br />
            Simple tipping.
          </h2>
          <p className="mx-auto mt-14 max-w-[480px] text-[13px] leading-relaxed text-[#5B6475] poppins-medium sm:mx-0 sm:mt-16 sm:text-[15px]">
            TipApp uses Stripe, a world-class secure payment gateway to keep
            your transactions safe, encrypted and private.
          </p>

          <div className="mt-28 grid gap-20 sm:mt-36 sm:grid-cols-3 sm:gap-20">
            {FEATURES.map(({ title, description, Icon, iconBg }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <span
                  className={`flex h-[44px] w-[44px] items-center justify-center rounded-full text-white ${iconBg}`}
                >
                  <Icon className="h-[19px] w-[19px]" strokeWidth={2.25} />
                </span>
                <p className="mt-12 text-[14px] leading-tight text-[#1A1A2E] poppins-bold sm:mt-14">
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
          className="ta-animate-slide-up mx-auto w-full max-w-[420px] sm:max-w-[520px] lg:mx-0 lg:max-w-none lg:justify-self-end"
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
