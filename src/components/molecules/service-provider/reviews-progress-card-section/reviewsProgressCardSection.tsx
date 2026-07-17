import { useEffect, useState } from "react";
import RatingProgressRowCard from "@/components/atoms/cards/rating-progress-row-card/ratingProgressRowCard";

interface Props {
  fiveStarPercentage: number;
  fourStarPercentage: number;
  threeStarPercentage: number;
  twoStarPercentage: number;
  oneStarPercentage: number;
  fiveStarProgress: number;
  fourStarProgress: number;
  threeStarProgress: number;
  twoStarProgress: number;
  oneStarProgress: number;
}

export const ReviewsProgressCardSection = (props: Props) => {
  const [fiveStarProgress, setFiveStarProgress] = useState(0);
  const [fourStarProgress, setFourStarProgress] = useState(0);
  const [threeStarProgress, setThreeStarProgress] = useState(0);
  const [twoStarProgress, setTwoStarProgress] = useState(0);
  const [oneStarProgress, setOneStarProgress] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFiveStarProgress(props.fiveStarProgress), 500),
      setTimeout(() => setFourStarProgress(props.fourStarProgress), 500),
      setTimeout(() => setThreeStarProgress(props.threeStarProgress), 500),
      setTimeout(() => setTwoStarProgress(props.twoStarProgress), 500),
      setTimeout(() => setOneStarProgress(props.oneStarProgress), 500),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [
    props.fiveStarProgress,
    props.fourStarProgress,
    props.threeStarProgress,
    props.twoStarProgress,
    props.oneStarProgress,
  ]);

  return (
    <div className="sm:bg-card sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)] max-w-[350px] min-h-[211px] sm:min-w-[350px] max-h-[211px] h-full w-full flex flex-col rounded-16 pt-31 pb-20 justify-between">
      <RatingProgressRowCard
        stars={5}
        percentage={props.fiveStarPercentage}
        progress={fiveStarProgress}
      />
      <RatingProgressRowCard
        stars={4}
        percentage={props.fourStarPercentage}
        progress={fourStarProgress}
      />
      <RatingProgressRowCard
        stars={3}
        percentage={props.threeStarPercentage}
        progress={threeStarProgress}
      />
      <RatingProgressRowCard
        stars={2}
        percentage={props.twoStarPercentage}
        progress={twoStarProgress}
      />
      <RatingProgressRowCard
        stars={1}
        percentage={props.oneStarPercentage}
        progress={oneStarProgress}
      />
    </div>
  );
};
