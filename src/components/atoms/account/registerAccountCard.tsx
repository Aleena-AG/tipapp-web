import { Plus } from "lucide-react";
import { MouseEventHandler } from "react";

export const RegisterAccountCard = ({
  title,
  onClick,
}: {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group flex w-full items-center gap-3 rounded-[12px] border border-dashed border-[#C7D2E0] bg-[#F8FAFD] px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-[1px] hover:border-[#0B538D] hover:shadow-[0_8px_20px_rgba(11,83,141,0.10)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF3FA] transition-colors group-hover:bg-[#0B538D]">
        <Plus className="h-[18px] w-[18px] text-[#0B538D] transition-colors group-hover:text-white" />
      </span>
      <span className="poppins-semibold flex-1 text-[14px] leading-tight text-[#1B1B1B]">
        Sign in as a {title}
      </span>
    </button>
  );
};
