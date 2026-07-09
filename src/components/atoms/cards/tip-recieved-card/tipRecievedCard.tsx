/* eslint-disable @typescript-eslint/no-explicit-any */
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import {
  getRoleAvatarFallback,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";
import { TipItemType } from "@/utils/types/types";
import { getDateValueFormated } from "@/hooks/hooks";
import { formatNumber } from "@/hooks/formatters";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isScrollable: boolean;
  scrollableTarget?: string;
}

const getPaymentMethodLabel = (type?: string) =>
  type === "BALANCE" ? "Account Balance" : "Card";

const PaymentMethodBadge = ({ type }: { type?: string }) => {
  const isBalance = type === "BALANCE";
  return (
    <span
      className={`poppins-medium inline-flex items-center rounded-full px-12 py-4 text-[11px] ${
        isBalance
          ? "bg-[#E8F5EE] text-[#1A7A4A]"
          : "bg-[#EAF3FA] text-[#0B538D]"
      }`}
    >
      {getPaymentMethodLabel(type)}
    </span>
  );
};

const TipRecievedCard = (props: Props) => {
  const { t } = useTranslation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isScrollable,
    scrollableTarget,
  } = props;

  let rowIndex = 0;

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={
          data?.pages.reduce(
            (acc: number, page: any) => acc + page.items.length,
            0
          ) || 0
        }
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        scrollableTarget={scrollableTarget}
        loader={
          <SpinLoader
            isLoading={isFetchingNextPage}
            isLoadingTextVisible={true}
          />
        }
        endMessage={
          isScrollable && (
            <p className="poppins-medium border-t border-[#E8EEF4] py-20 text-center text-[13px] text-[#9A9A9A]">
              {t("common.youHaveSeenItAll")}
            </p>
          )
        }
      >
        {data?.pages.map((page: any, pageIndex: number) => (
          <div key={pageIndex} className="flex w-full flex-col">
            {page.items.map((item: TipItemType, index: number) => {
              const isEven = rowIndex % 2 === 0;
              rowIndex += 1;

              return (
                <div
                  className={`flex w-full flex-row items-center justify-between gap-12 border-b border-[#E8EEF4] px-16 py-16 transition-colors last:border-b-0 hover:bg-[#F0F7FC] sm:px-24 sm:py-16 lg:grid lg:grid-cols-[2fr_1fr_1fr_1.2fr] lg:items-center lg:gap-24 ${
                    isEven ? "bg-white" : "bg-[#FAFCFE]"
                  }`}
                  key={index}
                >
                  {/* Service Provider */}
                  <div className="flex min-w-0 flex-1 flex-row items-center gap-12 sm:gap-16">
                    <Avatar className="h-10 w-10 shrink-0 sm:h-11 sm:w-11">
                      <AvatarImage
                        src={resolveProfileImageSrc(
                          item.serviceProvider?.ProfilePictureURL,
                          getRoleAvatarFallback(
                            item.serviceProvider?.Role ?? "sp"
                          )
                        )}
                        alt={
                          item.serviceProvider?.FirstName ||
                          t("userSelection.tipper")
                        }
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback className="bg-transparent p-0">
                        <img
                          src={getRoleAvatarFallback(
                            item.serviceProvider?.Role ?? "sp"
                          )}
                          alt="User Image"
                          className="h-full w-full object-cover"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="poppins-semibold truncate text-[14px] text-[#141414]">
                        {item.serviceProvider?.FirstName &&
                        item.serviceProvider?.LastName
                          ? `${item.serviceProvider.FirstName} ${item.serviceProvider.LastName}`
                          : "N.A"}
                      </span>
                      <span className="poppins-medium text-[12px] text-[#9A9A9A] lg:hidden">
                        {getDateValueFormated(item.createdAt || "N.A")}
                      </span>
                    </div>
                  </div>

                  {/* Date — desktop */}
                  <span className="poppins-medium hidden text-[13px] text-[#5A6570] lg:block">
                    {getDateValueFormated(item.createdAt || "N.A")}
                  </span>

                  {/* Amount + Method — mobile */}
                  <div className="flex shrink-0 flex-col items-end gap-4 lg:hidden">
                    <span className="poppins-semibold text-[14px] text-[#0B538D]">
                      {formatNumber(
                        item.Amount,
                        true,
                        1,
                        item.Currency || "GBP"
                      )}
                    </span>
                    <PaymentMethodBadge type={item.PaymentMethodType} />
                  </div>

                  {/* Amount — desktop */}
                  <span className="poppins-semibold hidden text-[14px] text-[#0B538D] lg:block lg:text-right">
                    {formatNumber(
                      item.Amount,
                      true,
                      1,
                      item.Currency || "GBP"
                    )}
                  </span>

                  {/* Method — desktop */}
                  <div className="hidden justify-end lg:flex">
                    <PaymentMethodBadge type={item.PaymentMethodType} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TipRecievedCard;
