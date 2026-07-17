import {
  CreditCard,
  Heart,
  History,
  LogIn,
  QrCode,
  Star,
  Store,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  accent?: "blue" | "red";
  Icon?: LucideIcon;
  delayClass?: string;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  accent = "blue",
  Icon = QrCode,
  delayClass = "",
}) => {
  const isBlue = accent === "blue";

  return (
    <div
      className={`ta-animate-pop group flex h-full flex-col gap-10 rounded-[14px] border bg-card px-14 pb-16 pt-16 shadow-[0_6px_18px_rgba(11,83,141,0.06)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_10px_24px_rgba(11,83,141,0.1)] dark:bg-slate-900/60 dark:shadow-[0_6px_18px_rgba(0,0,0,0.3)] dark:hover:border-slate-600 ${
        isBlue
          ? "border-[#D6E6F3] dark:border-slate-700/80"
          : "border-[#F0CDD0] dark:border-red-900/40"
      } ${delayClass}`}
    >
      <div className="flex items-center justify-between">
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
        <span
          className={`flex h-[28px] min-w-[28px] items-center justify-center rounded-full px-6 text-[12px] poppins-semibold text-white ${
            isBlue ? "bg-[#0B538D] dark:bg-[#2563EB]" : "bg-[#d71921]"
          }`}
        >
          {step}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="poppins-semibold text-[14px] leading-snug text-[#0B2C4A] sm:text-[15px] dark:text-white">
          {title}
        </h3>
        <p className="poppins-regular text-[12px] leading-[17px] text-[#6B7A8A] sm:text-[13px] sm:leading-[19px] dark:text-slate-400">
          {description}
        </p>
      </div>

      <span
        className={`mt-auto h-[3px] w-[28px] rounded-full ${
          isBlue ? "bg-[#0B538D]" : "bg-[#d71921]"
        }`}
      />
    </div>
  );
};

export const tipperStepIcons: LucideIcon[] = [
  LogIn,
  QrCode,
  UserRound,
  Star,
  CreditCard,
  History,
];

export const serviceProviderStepIcons: LucideIcon[] = [
  Store,
  QrCode,
  Heart,
  Star,
  Wallet,
  CreditCard,
];

export default StepCard;
