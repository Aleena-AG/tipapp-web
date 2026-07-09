import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";

interface StepCardProps {
  step: number;
  icon: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-20 flex flex-col gap-12 h-full">
      <div className="flex items-center gap-12">
        <div className="w-[44px] h-[44px] rounded-full bg-black text-white flex items-center justify-center text-sm poppins-semibold">
          {step}
        </div>
        <img src={icon} alt="step icon" className="w-[28px] h-[28px]" />
      </div>
      <div className="flex flex-col gap-6">
        <PrimaryTypo typo={title} styles="text-[18px]" />
        <div className="text-[#000] opacity-60 text-[14px] leading-[22px] poppins-regular">
          {description}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
