// import { useGetTipHistoryDetailsByServiceProvider } from "@/api/tipManagement";
import { useGetRatingSummaryByID } from "@/api/tipManagement";
import { useNavigate } from "react-router-dom";
import { ProfileImage } from "@/utils/constants/UsersData";
import { ProgressCardSection } from "@/components/organisms/tip-provider/SP-Overall-Rating-Container/ProgressCardSection";
import { RatingsCardSection } from "@/components/organisms/tip-provider/SP-Overall-Rating-Container/RatingCardSection";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";

const SPOverallRatingSection = ({ userID }: { userID: string }) => {
  const { t } = useTranslation();
  const { data: tipsPercentageData, isLoading: isTipsPercentageLoading } =
    useGetRatingSummaryByID(userID);

  const formattedRating = tipsPercentageData?.overallRating || "0.0";

  const ratingsDistribution = tipsPercentageData?.ratingsDistribution || [];
  const ratingsMap = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratingsDistribution.forEach(
    (rating: { rating: number; percentage: string }) => {
      ratingsMap[rating.rating as 1 | 2 | 3 | 4 | 5] = parseFloat(
        rating.percentage
      );
    }
  );

  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  const handleNavigateHome = () => {
    if (!isAuthenticated()) {
      navigate("/sign-in");
      return;
    }

    localStorage.removeItem("ServiceProviderID");
    navigate("/tip-provider");
  };

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col">
      {/* Header */}
      <div className="mb-24 flex items-center gap-12">
        <button
          onClick={handleNavigateHome}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E4EDF5] bg-card text-[#0B538D] shadow-sm transition-colors hover:bg-[#EAF3FA]"
          aria-label={t("buttons.back")}
        >
          <FaArrowLeft className="text-[14px]" />
        </button>
        <div>
          <h1 className="poppins-semibold text-[22px] text-[#0B538D] sm:text-[26px]">
            {t("common.overallRating")}
          </h1>
          <p className="poppins-regular mt-2 text-[13px] text-[#7A7A7A] dark:text-slate-400">
            {t("common.customerRatings")}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-20 sm:items-stretch">
        <RatingsCardSection
          isLoading={isTipsPercentageLoading}
          customerCount={tipsPercentageData?.totalRatings || 0}
          rating={parseFloat(formattedRating)}
          review={parseFloat(formattedRating)}
          serviceProviderName={tipsPercentageData?.ServiceProviderName || "N/A"}
          ProfilePicture={tipsPercentageData?.ProfilePicture || ProfileImage}
        />
        <ProgressCardSection
          fiveStarPercentage={ratingsMap[5]}
          fourStarPercentage={ratingsMap[4]}
          threeStarPercentage={ratingsMap[3]}
          twoStarPercentage={ratingsMap[2]}
          oneStarPercentage={ratingsMap[1]}
          fiveStarProgress={ratingsMap[5]}
          fourStarProgress={ratingsMap[4]}
          threeStarProgress={ratingsMap[3]}
          twoStarProgress={ratingsMap[2]}
          oneStarProgress={ratingsMap[1]}
        />
      </div>

      <button
        type="button"
        onClick={handleNavigateHome}
        className="mx-auto mt-32 flex h-[50px] w-full max-w-[328px] items-center justify-center rounded-[14px] bg-gradient-to-r from-[#0B538D] to-[#0077B6] text-white shadow-[0_6px_18px_rgba(11,83,141,0.3)] transition-all hover:shadow-[0_8px_22px_rgba(11,83,141,0.4)]"
      >
        <span className="poppins-semibold text-[15px]">
          {t("common.backToHome")}
        </span>
      </button>
    </div>
  );
};

export default SPOverallRatingSection;
