/* eslint-disable @typescript-eslint/no-explicit-any */
import InfiniteScroll from "react-infinite-scroll-component";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { getDateValueFormated } from "@/hooks/hooks";
import { formatNumber } from "@/hooks/formatters";
import { FaPaperPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function getCurrencySymbol(currency?: string): string {
  switch ((currency || "GBP").toUpperCase()) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "AED":
      return "AED ";
    default:
      return "£";
  }
}

interface Props {
  data: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isScrollable: boolean;
}

const BalanceTransferHistoryCard = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isScrollable,
}: Props) => {
  const { t } = useTranslation();

  return (
    <InfiniteScroll
      dataLength={
        data?.pages.reduce(
          (acc: number, page: any) => acc + page.items.length,
          0
        ) || 0
      }
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <SpinLoader
          isLoading={isFetchingNextPage}
          isLoadingTextVisible={true}
        />
      }
      endMessage={
        isScrollable && (
          <p className="py-16 text-center text-[13px] text-gray-400 poppins-medium">
            {t("payments.allHistoryLoaded")}
          </p>
        )
      }
      refreshFunction={fetchNextPage}
      pullDownToRefresh
      pullDownToRefreshThreshold={600}
    >
      <div className="flex flex-col gap-10">
        {data?.pages.map((page: any, pageIndex: number) =>
          page.items.map((item: any, _index: number) => {
            const currency =
              item.amounts?.gross?.currency || item.Currency || "GBP";
            const currencySymbol = getCurrencySymbol(currency);
            const amount =
              item.gross ??
              item.amounts?.gross?.amount ??
              item.netTransferred ??
              item.amounts?.netTransferred?.amount;
            const createdAt = item.createdAt || item.CreatedAt || "N.A";

            return (
              <div
                key={item.TipId ?? `${pageIndex}-${_index}`}
                className="flex items-center justify-between gap-12 rounded-xl border border-gray-100 bg-gray-50/60 px-14 py-13 transition-colors hover:border-[#9E2A2B]/20 hover:bg-white"
              >
                <div className="flex min-w-0 items-center gap-12">
                  <div className="flex h-38 w-38 shrink-0 items-center justify-center rounded-full bg-[#9E2A2B]/10 text-[#9E2A2B]">
                    <FaPaperPlane className="text-[13px]" />
                  </div>
                  <div className="min-w-0">
                    <SecondaryTypo
                      typo={getDateValueFormated(createdAt)}
                      styles="text-[13px] leading-tight poppins-semibold text-gray-800"
                    />
                    <p className="mt-3 text-[11px] text-gray-500 poppins-regular">
                      Ref:{" "}
                      <span className="poppins-medium text-gray-700">
                        {item.TipId}
                      </span>
                    </p>
                    {item.serviceProviderName && (
                      <p className="mt-3 truncate text-[11px] text-gray-500 poppins-regular">
                        {t("payments.to")}:{" "}
                        <span className="poppins-medium text-[#9E2A2B]">
                          {item.serviceProviderName}
                        </span>
                      </p>
                    )}
                    <span className="mt-5 inline-block rounded-full bg-[#9E2A2B]/10 px-8 py-2 text-[10px] poppins-medium text-[#9E2A2B]">
                      {t("payments.balanceTransfer")}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <PrimaryTypo
                    typo={
                      formatNumber(amount, true, 1, currencySymbol) || "N.A"
                    }
                    styles="!text-[15px] poppins-semibold text-[#9E2A2B]"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </InfiniteScroll>
  );
};

export default BalanceTransferHistoryCard;
