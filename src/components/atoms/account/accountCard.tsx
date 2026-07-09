import { Check, User, Store } from "lucide-react";

export const AccountCard = ({
  title,
  selected,
  variant,
}: {
  title: string;
  selected: boolean;
  variant?: "tp" | "sp";
}) => {
  const isTp = variant === "tp";
  const baseColor = isTp ? "#0B538D" : "#9E2A2B";
  const softBg = isTp ? "#EAF3FA" : "#FBEDED";
  const Icon = isTp ? User : Store;

  return (
    <button
      type="button"
      className={`group relative flex w-full items-center gap-3 rounded-[12px] px-3.5 py-3 text-left transition-all duration-200 ${
        selected
          ? "text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
          : "border border-[#E7ECF3] bg-white text-[#1B1B1B] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
      }`}
      style={selected ? { backgroundColor: baseColor } : undefined}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{
          backgroundColor: selected ? "rgba(255,255,255,0.18)" : softBg,
        }}
      >
        <Icon
          className="h-[18px] w-[18px]"
          style={{ color: selected ? "#ffffff" : baseColor }}
        />
      </span>

      <span className="poppins-semibold flex-1 text-[14px] leading-tight">
        {title}
      </span>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-white" : "border border-[#D5DCE6] bg-transparent"
        }`}
      >
        {selected && (
          <Check
            className="h-3 w-3"
            strokeWidth={3}
            style={{ color: baseColor }}
          />
        )}
      </span>
    </button>
  );
};
