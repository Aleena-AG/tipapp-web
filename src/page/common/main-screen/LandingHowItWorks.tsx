import { ChevronRight } from "lucide-react";
import howScan from "@/assets/images/landing/how-scan.png";
import howSend from "@/assets/images/landing/how-send.png";
import howReceive from "@/assets/images/landing/how-receive.png";

const STEPS = [
  {
    step: 1,
    title: "Scan QR Code",
    description: "Scan any TipApp QR from a service provider.",
    image: howScan,
    alt: "Scan a TipApp QR stand with your phone",
  },
  {
    step: 2,
    title: "Send Tip",
    description: "Enter amount and send tip securely.",
    image: howSend,
    alt: "Send a tip from the TipApp phone screen",
  },
  {
    step: 3,
    title: "Tip Received",
    description: "Amount goes directly to the provider's TipApp wallet.",
    image: howReceive,
    alt: "Tip received in the TipApp wallet",
  },
] as const;

export const LandingHowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-[72px] px-16 py-36 sm:scroll-mt-[88px] sm:px-24 sm:py-48 lg:px-32 lg:py-64"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="ta-animate-fade text-center text-[24px] leading-tight tracking-tight poppins-bold sm:text-[34px] lg:text-[38px]">
          <span className="text-[#1A1A2E]">How </span>
          <span className="text-[#1A1A2E]">Tip</span>
          <span className="relative inline-block text-[#B3000C]">
            Tapp
            <span className="absolute -bottom-6 left-1/2 h-[3px] w-[42px] -translate-x-1/2 rounded-full bg-[#B3000C]" />
          </span>
          <span className="text-[#1A1A2E]"> Works</span>
        </h2>

        <div className="mt-32 flex flex-col items-stretch gap-16 sm:mt-40 sm:gap-20 md:grid md:grid-cols-3 md:gap-16 lg:mt-48 lg:flex lg:flex-row lg:items-center lg:gap-0">
          {STEPS.map((item, i) => (
            <div key={item.step} className="flex flex-1 items-center">
              <article
                className="landing-card-from-left relative w-full rounded-[20px] border border-[#E8ECF1] bg-[#F4F5F7] px-14 pb-20 pt-18 text-center shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:px-16 sm:pb-22 sm:pt-20"
                style={{ animationDelay: `${120 + i * 120}ms` }}
              >
                <div className="mx-auto mt-8 flex h-[160px] w-full items-center justify-center overflow-hidden rounded-[16px] sm:h-[190px]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-contain object-center"
                    draggable={false}
                  />
                </div>

                <h3 className="mt-14 text-[15px] text-[#1A1A2E] poppins-bold sm:mt-16 sm:text-[17px]">
                  {item.title}
                </h3>
                <p className="mx-auto mt-8 max-w-[240px] text-[12px] leading-snug text-[#5B6475] poppins-medium sm:text-[13px]">
                  {item.description}
                </p>
              </article>

              {i < STEPS.length - 1 && (
                <ChevronRight
                  className="mx-8 hidden h-8 w-8 shrink-0 text-[#0B538D] lg:block"
                  strokeWidth={2.25}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
