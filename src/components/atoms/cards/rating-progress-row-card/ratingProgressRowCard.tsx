import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { Progress } from "@/components/ui/progress";

interface RatingRowProps {
  stars: number;
  percentage: number;
  progress: number;
}

const RatingProgressRowCard = ({
  stars,
  percentage,
  progress,
}: RatingRowProps) => (
  <div className="flex w-full justify-between px-6 sm:px-32 items-center gap-x-10">
    <div className=" flex-[1.5]">
      <PrimaryTypo
        typo={`${stars} Stars`}
        styles="poppins-medium !text-[13px]"
      />
    </div>
    <div className=" flex-[5]">
      <Progress
        value={progress ? progress : 0}
        className="minw-[240px]max-w-[240px] h-2 "
        color="#F4D11B"
      />
    </div>
    <div className=" flex-[1.5] ">
      <PrimaryTypo
        typo={`${percentage ? percentage : 0}%`}
        styles="poppins-medium text-[13px]"
      />
    </div>
  </div>
);

export default RatingProgressRowCard;
