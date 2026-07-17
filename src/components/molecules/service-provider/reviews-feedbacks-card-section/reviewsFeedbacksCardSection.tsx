import ReviewFeedbackCard from "@/components/atoms/cards/review-feedback-card/reviewFeedbackCard";
import { TipItemType } from "@/utils/types/types";
import { useState, useEffect, useRef } from "react";
import { resolveProfileImageSrc } from "@/utils/imageUtils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetTipHistoryDetailsByServiceProvider } from "@/api/tipManagement";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import NoDataFoundSection from "../../common/no-data-found/NoDataFoundSection";
import { useTranslation } from "react-i18next";

const ReviewsFeedbacksCardSection = () => {
  const { t } = useTranslation();
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTipHistoryDetailsByServiceProvider();
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

  return (
    <div
      ref={containerRef}
      className={`rounded-16 sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)] sm:bg-card min-h-[420px] max-h-[420px] sm:min-w-[663px] max-w-[663px] overflow-y-auto mt-12 sm:p-32 gap-y-24 flex flex-col ${
        isLoading ? "justify-center items-center" : ""
      }`}
    >
      {isLoading ? (
        <SpinLoader isLoading={isLoading} />
      ) : totalItems === 0 ? (
        <>
          <div className="w-full h-full ">
            <NoDataFoundSection />
          </div>
        </>
      ) : (
        <>
          <InfiniteScroll
            dataLength={
              data?.pages.reduce((acc, page) => acc + page.items.length, 0) || 0
            }
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <SpinLoader isLoading={isLoading} isLoadingTextVisible={true} />
            }
            endMessage={
              isScrollable && (
                <p style={{ textAlign: "center" }}>
                  <b>{t("common.youHaveSeenItAll")}</b>
                </p>
              )
            }
            refreshFunction={fetchNextPage}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
          >
            {data?.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-24 mb-24">
                {page.items.map((feedback: TipItemType, index: number) => (
                  <ReviewFeedbackCard
                    key={index}
                    id={feedback.TipId}
                    feedback={feedback.Review ? feedback.Review : ""}
                    rating={feedback.Rating ? feedback.Rating : 0}
                    imageUrl={resolveProfileImageSrc(
                      feedback.tipper.ProfilePictureURL
                    )}
                    name={
                      feedback.tipper.FirstName + feedback.tipper.LastName
                        ? feedback.tipper.FirstName +
                          " " +
                          feedback.tipper.LastName
                        : "N.A"
                    }
                    isReplying={replyingId === feedback.TipId}
                    comment={feedback.Comment}
                    setReplyingId={setReplyingId}
                  />
                ))}
              </div>
            ))}
          </InfiniteScroll>
          {isFetchingNextPage && (
            <SpinLoader
              isLoading={isFetchingNextPage}
              isLoadingTextVisible={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsFeedbacksCardSection;
