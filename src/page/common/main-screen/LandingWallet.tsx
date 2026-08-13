import { CreditCard, Wallet } from "lucide-react";
import walletPhone from "@/assets/images/landing/wallet-phone.png";

export const LandingWallet = () => {
  return (
    <section
      id="benefits"
      className="landing-wallet relative scroll-mt-[88px] px-16 py-48 sm:px-24 lg:px-32 lg:py-64"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-40">
        <div className="ta-animate-fade mx-auto w-full">
          <img
            src={walletPhone}
            alt="TipApp wallet, tip balance, get tipped and tip others"
            className="h-auto w-full object-contain object-center select-none"
            draggable={false}
          />
        </div>

        <div
          className="ta-animate-slide-up text-left"
          style={{ animationDelay: "160ms" }}
        >
          <p className="text-[15px] poppins-semibold sm:text-[16px]">
            <span className="text-[#B3000C]">One Wallet.</span>{" "}
            <span className="text-[#0B538D]">Two Ways to Tip.</span>
          </p>
          <h2 className="mt-14 max-w-[420px] text-[26px] leading-[1.2] tracking-tight text-[#1A1A2E] poppins-bold sm:text-[32px] lg:text-[34px]">
            Get tipped. Keep your balance. Tip someone else.
          </h2>

          <div className="mt-28 grid overflow-hidden rounded-[16px] border border-[#E4E7EE] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:grid-cols-2 sm:divide-x sm:divide-[#E8ECF1]">
            <div className="flex items-start gap-12 border-b border-[#E8ECF1] px-16 py-18 sm:border-b-0">
              <span className="mt-1 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#FFE5E8] text-[#B3000C]">
                <Wallet className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[14px] text-[#1A1A2E] poppins-bold">
                  TipApp Balance
                </p>
                <p className="mt-4 text-[12px] leading-snug text-[#5B6475] poppins-medium">
                  Pay using your wallet balance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-12 px-16 py-18">
              <span className="mt-1 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#E8F1FF] text-[#0B538D]">
                <CreditCard className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[14px] text-[#1A1A2E] poppins-bold">
                  Debit or Credit Card
                </p>
                <p className="mt-4 text-[12px] leading-snug text-[#5B6475] poppins-medium">
                  Pay securely with your card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
