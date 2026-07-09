 
import { useGetTipHistoryDetailsByServiceProvider } from "@/api/tipManagement";
import TipRecievedCardServiceprovider from "@/components/atoms/cards/tip-recieved-card/tipRecievedCardServiceprovider";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { useEffect, useRef, useState } from "react";
import NoDataFoundSection from "../../common/no-data-found/NoDataFoundSection";
import { useTranslation } from "react-i18next";

const ViewHistoryCardSection = () => {
  const { t } = useTranslation();
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
    <>
      <div className="flex max-w-[527px] sm:min-w-[527px] mx-auto mb-8 justify-start">
        <PrimaryTypo
          typo={t("common.received")}
          styles="text-center !text-[20px] "
        />
      </div>
      <div
        ref={containerRef}
        className={`sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)] sm:bg-white min-w-full sm:min-w-[527px] mx-auto rounded-2xl min-h-[220px] max-h-[42vh] sm:min-h-[624px] sm:max-h-[624px] overflow-y-auto secondary-scrollabr overflow-x-hidden py-16 px-10 sm:py-24 sm:px-15 flex flex-col gap-26 ${
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
            <TipRecievedCardServiceprovider
              data={data}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isScrollable={isScrollable}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ViewHistoryCardSection;
