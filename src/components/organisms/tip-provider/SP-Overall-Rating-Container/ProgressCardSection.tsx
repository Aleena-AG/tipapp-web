import { useEffect, useState } from "react";
import RatingRow from "@/components/organisms/tip-provider/SP-Overall-Rating-Container/RatingRow";

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

export const ProgressCardSection = (props: Props) => {
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
    <div className="sm:bg-card max-w-full min-h-[211px] min-w-[320px] sm:min-w-[405px] max-h-[211px] h-full w-full flex flex-col rounded-16 pt-31 pb-20 justify-between sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]">
      <RatingRow
        stars={5}
        percentage={props.fiveStarPercentage}
        progress={fiveStarProgress}
      />
      <RatingRow
        stars={4}
        percentage={props.fourStarPercentage}
        progress={fourStarProgress}
      />
      <RatingRow
        stars={3}
        percentage={props.threeStarPercentage}
        progress={threeStarProgress}
      />
      <RatingRow
        stars={2}
        percentage={props.twoStarPercentage}
        progress={twoStarProgress}
      />
      <RatingRow    
        stars={1}
        percentage={props.oneStarPercentage}
        progress={oneStarProgress}
      />
    </div>
  );
};
