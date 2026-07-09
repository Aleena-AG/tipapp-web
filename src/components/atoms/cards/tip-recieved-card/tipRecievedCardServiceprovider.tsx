/* eslint-disable @typescript-eslint/no-explicit-any */
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import {
  getRoleAvatarFallback,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";
import { getDateValueFormated } from "@/hooks/hooks";
import { formatNumber } from "@/hooks/formatters";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isScrollable: boolean;
}

const TipRecievedCardServiceprovider = ({
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
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        )
      }
      refreshFunction={fetchNextPage}
      pullDownToRefresh
      pullDownToRefreshThreshold={600}
    >
      {data?.pages.map((page: any, pageIndex: number) => (
        <div key={pageIndex} className="flex flex-col gap-24 mb-24 ">
          {page.items.map((item: any, index: number) => (
            <div
              className="flex flex-row items-center justify-between sm:gap-50 w-full"
              key={index}
            >
              <div className="flex flex-row items-center gap-16 w-full">
                <Avatar className="h-[60px] w-[60px]">
                  <AvatarImage
                    src={resolveProfileImageSrc(
                      item.tipper?.ProfilePictureURL,
                      getRoleAvatarFallback(item.tipper?.Role ?? "tp")
                    )}
                    alt={item.tipper?.FirstName || t("userSelection.tipper")}
                    className="w-full h-full object-cover "
                  />
                  <AvatarFallback className="bg-transparent p-0">
                    <img
                      src={getRoleAvatarFallback(item.tipper?.Role ?? "tp")}
                      alt="User Image"
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-4">
                  <PrimaryTypo
                    typo={
                      item.tipper?.FirstName && item.tipper?.LastName
                        ? `${item.tipper.FirstName} ${item.tipper.LastName}`
                        : "N.A"
                    }
                    styles={"text-sm leading-[21px] max-w-[180px] break-words"}
                  />
                  <SecondaryTypo
                    typo={getDateValueFormated(item.createdAt || "N.A")}
                    styles={"text-sm leading-[21px] poppins-medium"}
                  />
                </div>
              </div>
              <div className="w-fit">
                <PrimaryTypo
                  typo={`${
                    formatNumber(
                      item.NetAmount || item.Amount,
                      true,
                      1,
                      item.Currency || "GBP"
                    ) || "N.A"
                  }`}
                  styles={
                    "text-sm leading-[21px] w-full min-w-[120px] flex items-end justify-end"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default TipRecievedCardServiceprovider;
