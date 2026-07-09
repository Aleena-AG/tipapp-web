import SpinLoader from "@/components/atoms/laoder/spin-loader";
import Rating from "@/components/atoms/rating/Rating";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useTranslation } from "react-i18next";

interface Props {
  review: number;
  rating: number;
  isLoading: boolean;
  customerCount: number;
}

export const ReviewsRatingsCardSection = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)] sm:bg-white max-w-[300px] min-h-[211px] sm:min-w-[300px] max-h-[211px] h-full w-full flex flex-col rounded-16 pt-24 justify-between">
      <PrimaryTypo
        typo={t("common.overallRating")}
        styles="text-center text-[15px]"
      />
      {props.isLoading ? (
        <>
          <SpinLoader isLoading={props.isLoading} />
        </>
      ) : (
        <>
          <span className="text-center poppins-medium text-black opacity-70 text-[20.15px] leading-normal">{`${
            props.rating ? props.rating + " / 5" : 0 + " / 5"
          }`}</span>
          <div className="flex items-center justify-center py-10">
            <Rating
              value={props.rating ? props.rating : 0}
              onChange={() => {}}
              size={24}
              isToDisplay={true}
            />
          </div>
          <div className="text-center text-black text-xs poppins-medium opacity-50 pb-37">
            {props.customerCount} {t("common.customerRatings")}
          </div>
        </>
      )}
    </div>
  );
};
