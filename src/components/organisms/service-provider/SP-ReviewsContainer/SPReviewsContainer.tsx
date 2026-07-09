// import { useGetTipHistoryDetailsByServiceProvider } from "@/api/tipManagement";
import { useGetMyTipsPercentage } from "@/api/tipManagement";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import ReviewsFeedbacksCardSection from "@/components/molecules/service-provider/reviews-feedbacks-card-section/reviewsFeedbacksCardSection";
import { ReviewsProgressCardSection } from "@/components/molecules/service-provider/reviews-progress-card-section/reviewsProgressCardSection";
import { ReviewsRatingsCardSection } from "@/components/molecules/service-provider/reviews-ratings-card-section/reviewsRatingsCardSection";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SPReviewsContainer = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: tipsPercentageData, isLoading: isTipsPercentageLoading } =
    useGetMyTipsPercentage();

  useEffect(() => {
    setLoading(isTipsPercentageLoading);
  }, [isTipsPercentageLoading]);

  const formattedRating = tipsPercentageData?.overallRating
    ? tipsPercentageData.overallRating
    : "0.0";

  // Extract rating percentages
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

  const handleNavigateTipBalance = () => {
    navigate("/service-provider/tip-balance");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col max-w-[663px] mx-auto items-center sm:items-start">
      <div className="flex items-center justify-between w-full">
        <PrimaryTypo
          typo={t("common.reviews")}
          styles="!text-[20px] poppins-semibold leading-6 mb-8"
        />
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <FaArrowLeft className="text-sm" />
          <span className="text-sm poppins-medium">{t("buttons.back")}</span>
        </button>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
        <ReviewsRatingsCardSection
          isLoading={loading}
          customerCount={tipsPercentageData?.totalRatings || 0}
          rating={parseFloat(formattedRating)}
          review={parseFloat(formattedRating)}
        />
        <ReviewsProgressCardSection
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
      <PrimaryTypo
        typo={t("common.feedback")}
        styles="!text-[20px] poppins-semibold leading-6 mt-24 mb-8"
      />
      <ReviewsFeedbacksCardSection />
      <PrimaryButton
        typo={t("common.tipsBalance")}
        styles="w-full !rounded-8 bg-[#9E2A2B] hover:bg-[#ce260b] text-white text-base poppins-regular mt-42 max-w-[328px] mx-auto h-[48px]"
        handleOnClick={() => {
          handleNavigateTipBalance();
        }}
      />
    </div>
  );
};

export default SPReviewsContainer;
