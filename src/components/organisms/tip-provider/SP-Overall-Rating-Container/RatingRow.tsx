import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { Progress } from "@/components/ui/progress";
import { formatPercentage } from "@/hooks/formatters";

interface RatingRowProps {
  stars: number;
  percentage: number;
  progress: number;
}

const RatingRow = ({ stars, percentage, progress }: RatingRowProps) => (
  <div className="flex w-full justify-between sm:px-32 px-10 items-center gap-x-10">
    <div className=" flex-[1.5]">
      <PrimaryTypo
        typo={`${stars} Stars`}
        styles="poppins-medium !text-[13px]"
      />
    </div>
    <div className=" flex-[5]">
      <Progress
        value={progress ? progress : 0}
        className="sm:ml-5 sm:min-w-[480px] h-2 "
        color="#F4D11B"
      />
    </div>
    <div className=" flex-[1.5]">
      <PrimaryTypo
        typo={`${percentage ? formatPercentage(percentage) : 0}%`}
        styles="poppins-medium text-[13px] flex justify-end"
      />
    </div>
  </div>
);

export default RatingRow;
