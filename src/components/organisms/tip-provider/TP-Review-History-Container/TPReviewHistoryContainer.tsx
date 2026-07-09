import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetTipHistoryDetailsByTipper } from "@/api/tipManagement";
import TPReviewFeedbackCard from "@/components/atoms/cards/tp-review-feedback-card/tpReviewFeedbackCard";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { TipItemType } from "@/utils/types/types";
import InfiniteScroll from "react-infinite-scroll-component";
import NoDataFoundSection from "@/components/molecules/common/no-data-found/NoDataFoundSection";
import { useTranslation } from "react-i18next";

const TPReviewHistoryContainer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTipHistoryDetailsByTipper();
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setIsScrollable(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [data]);

  const totalItems =
    data?.pages.reduce((acc, page) => acc + page.items.length, 0) || 0;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-24 flex items-center gap-12">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E4EDF5] bg-white text-[#0B538D] shadow-sm transition-colors hover:bg-[#EAF3FA]"
          aria-label={t("buttons.back")}
        >
          <FaArrowLeft className="text-[14px]" />
        </button>
        <div>
          <h1 className="poppins-semibold text-[22px] text-[#0B538D] sm:text-[26px]">
            {t("common.yourReviews")}
          </h1>
          <p className="poppins-regular mt-2 text-[13px] text-[#7A7A7A]">
            {t("common.seeReviewsYouLeft") || "Reviews you left for others"}
          </p>
        </div>
      </div>

      {/* List card */}
      <div className="overflow-hidden rounded-[16px] border border-[#E4EDF5] bg-white shadow-sm">
        <div
          id="review-history-scroll"
          ref={containerRef}
          className={`themed-scroll ${
            isLoading || totalItems === 0
              ? "flex min-h-[400px] items-center justify-center"
              : "max-h-[calc(100vh-220px)] min-h-[360px] overflow-y-auto p-16 sm:p-24"
          }`}
        >
          {isLoading ? (
            <SpinLoader isLoading={isLoading} />
          ) : totalItems === 0 ? (
            <div className="flex w-full items-center justify-center px-24 py-48">
              <NoDataFoundSection />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={
                data?.pages.reduce((acc, page) => acc + page.items.length, 0) ||
                0
              }
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              scrollableTarget="review-history-scroll"
              loader={
                <SpinLoader isLoading={isLoading} isLoadingTextVisible={true} />
              }
              endMessage={
                isScrollable && (
                  <p className="poppins-medium py-16 text-center text-[13px] text-[#9A9A9A]">
                    {t("common.youHaveSeenItAll")}
                  </p>
                )
              }
            >
              <div className="flex flex-col gap-20">
                {data?.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="flex flex-col gap-20">
                    {page.items.map((item: TipItemType, index: number) => (
                      <TPReviewFeedbackCard
                        key={index}
                        feedback={item.Review}
                        rating={item.Rating}
                        imageUrl={item.serviceProvider.ProfilePictureURL}
                        name={
                          item.serviceProvider.FirstName +
                          " " +
                          item.serviceProvider.LastName
                        }
                        date={item.createdAt}
                        Comment={item.Comment}
                        replyPersonProfileURL={
                          item.serviceProvider.ProfilePictureURL
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
              {isFetchingNextPage && (
                <SpinLoader
                  isLoading={isFetchingNextPage}
                  isLoadingTextVisible={true}
                />
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default TPReviewHistoryContainer;
