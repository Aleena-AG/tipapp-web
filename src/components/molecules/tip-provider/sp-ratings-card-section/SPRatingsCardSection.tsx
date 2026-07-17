import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import Rating from "@/components/atoms/rating/Rating";
import { useTranslation } from "react-i18next";

interface Props {
  review: number;
  rating: number;
  isLoading: boolean;
  customerCount: number;
  serviceProviderName: string;
  ProfilePicture: string;
}

export const SPRatingsCardSection = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="sm:bg-card max-w-[660px] min-h-[140px] sm:min-w-[660px] max-h-[211px] h-full w-ful flex flex-col rounded-16 pt-24 sm:shadow-xl">
      {props.isLoading ? (
        <SpinLoader isLoading={props.isLoading} />
      ) : (
        <div className="flex flex-row items-center px-5">
          <div className="sm:w-[95px] sm:h-[95px] w-[90px] sm:ml-28 ml-[10px] sm:mr-17">
            <SafeImage
              src={props.ProfilePicture}
              alt="Profile Picture"
              className="sm:w-[95px] sm:h-[95px] w-[90px] h-[90px] object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col pl-4">
            <span className="poppins-medium text-black font-bold text-[16px] leading-normal">
              {props.serviceProviderName}
            </span>
            <span className="text-black text-xs poppins-medium opacity-50 mt-7">
              {props.customerCount
                ? `${props.customerCount} ${t("common.customerRatings")}`
                : `0 ${t("common.customerRatings")}`}
            </span>
          </div>
          <div className="flex-grow flex flex-col items-end">
            <div className="flex flex-col items-end mr-20">
              <span className="text-[20px] poppins-medium text-black opacity-70 mb-2 mr-10">
                {props.rating ? `${props.rating} / 5` : "0 / 5"}
              </span>
              <div className="flex items-center">
                <Rating
                  value={props.rating ? props.rating : 0}
                  onChange={() => {}}
                  size={24}
                  isToDisplay={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
