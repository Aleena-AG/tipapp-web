import { ReactNode } from "react";
import { FaChevronRight } from "react-icons/fa";

interface Props {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: "filled" | "outlined";
}

const SPQRActionButton = ({
  label,
  icon,
  onClick,
  variant = "filled",
}: Props) => {
  const isFilled = variant === "filled";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl px-16 py-14 transition-all duration-200 ${
        isFilled
          ? "bg-[#9E2A2B] text-white shadow-[0_4px_14px_rgba(158,42,43,0.35)] hover:bg-[#8a2425] active:scale-[0.99]"
          : "border-2 border-[#9E2A2B] bg-white text-[#9E2A2B] shadow-sm hover:bg-[#fdf8f8] active:scale-[0.99]"
      }`}
    >
      <div className="flex items-center gap-10">
        <div
          className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] ${
            isFilled ? "bg-white/20 text-white" : "bg-[#fce8e8] text-[#9E2A2B]"
          }`}
        >
          {icon}
        </div>
        <span className="text-[15px] poppins-medium">{label}</span>
      </div>
      <FaChevronRight
        className={`text-[13px] transition-transform group-hover:translate-x-1 ${
          isFilled ? "text-white/80" : "text-[#9E2A2B]/70"
        }`}
      />
    </button>
  );
};

export default SPQRActionButton;
