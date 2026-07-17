import SpinLoader from "@/components/atoms/laoder/spin-loader";
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

export const RatingsCardSection = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="sm:bg-card sm:max-w-[660px] min-h-[140px] sm:min-w-[660px] max-h-[211px] h-full max-w-[320px] flex flex-col rounded-16 pt-24 sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)] ">
      {props.isLoading ? (
        <SpinLoader isLoading={props.isLoading} />
      ) : (
        <div className="flex flex-row items-center sm:px-5 ">
          <div className="sm:w-[95px] sm:h-[95px] w-[90px] sm:ml-28  sm:mr-17">
            <img
              src={props.ProfilePicture}
              alt="Profile Picture"
              className="sm:w-[95px] sm:h-[95px] w-[60px] h-[60px] ml-5 object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col pl-4">
            <span className="poppins-medium text-black font-bold sm:text-[16px] text-[14px] leading-normal">
              {props.serviceProviderName}
            </span>
            <span className="text-black text-xs poppins-medium opacity-50 mt-7 sm:text-[16px] text-[14px]">
              {props.customerCount
                ? `${props.customerCount} ${t("common.customerRatings")}`
                : `0 ${t("common.customerRatings")}`}
            </span>
          </div>
          <div className="flex-grow flex flex-col items-end">
            <div className="flex flex-col items-end sm:mr-20">
              <span className="sm:text-[20px] text-[16px] poppins-medium text-black opacity-70 mb-2 mr-10">
                {props.rating ? `${props.rating} / 5` : "0 / 5"}
              </span>
              <div className="flex items-center">
                <Rating
                  value={props.rating ? props.rating : 0}
                  onChange={() => {}}
                  size={window.innerWidth <= 540 ? 18 : 24}
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
