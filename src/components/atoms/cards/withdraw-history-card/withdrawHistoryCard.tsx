/* eslint-disable @typescript-eslint/no-explicit-any */
import InfiniteScroll from "react-infinite-scroll-component";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import { getDateValueFormated } from "@/hooks/hooks";
import { formatNumber } from "@/hooks/formatters";
import { FaArrowDown } from "react-icons/fa";
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

const WithdrawHistoryCard = ({
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
            const currencySymbol = getCurrencySymbol(item.Currency);
            const createdAt = item.createdAt || item.CreatedAt || "N.A";
            const status = item.Status?.toLowerCase();

            return (
              <div
                key={item.InvoiceID ?? `${pageIndex}-${_index}`}
                className="flex items-center justify-between gap-12 rounded-xl border border-gray-100 bg-gray-50/60 px-14 py-13 transition-colors hover:border-[#9E2A2B]/20 hover:bg-white"
              >
                <div className="flex min-w-0 items-center gap-12">
                  <div className="flex h-38 w-38 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#9E2A2B]">
                    <FaArrowDown className="text-[14px]" />
                  </div>
                  <div className="min-w-0">
                    <SecondaryTypo
                      typo={getDateValueFormated(createdAt)}
                      styles="text-[13px] leading-tight poppins-semibold text-gray-800"
                    />
                    <p className="mt-3 text-[11px] text-gray-500 poppins-regular">
                      {t("payments.invoiceId")}:{" "}
                      <span className="poppins-medium text-gray-700">
                        {item.InvoiceID}
                      </span>
                    </p>
                    {status && (
                      <span
                        className={`mt-5 inline-block rounded-full px-8 py-2 text-[10px] poppins-medium capitalize ${
                          status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : status === "completed" || status === "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <PrimaryTypo
                    typo={
                      formatNumber(
                        item.TotalAmount,
                        true,
                        1,
                        currencySymbol
                      ) || "N.A"
                    }
                    styles="!text-[15px] poppins-semibold text-[#9E2A2B]"
                  />
                  {item?.PaymentMethod === "paymentMethodisCard" && (
                    <p className="mt-2 text-[11px] text-gray-400 poppins-regular">
                      {t("payments.creditCard")}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </InfiniteScroll>
  );
};

export default WithdrawHistoryCard;
