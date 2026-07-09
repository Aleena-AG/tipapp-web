import Rating from "../../rating/Rating";
import { PrimaryTypo } from "../../typo/primaryTypo";
import Vector from "@/assets/svg/add-reply-vector.svg";
import { getDateValue } from "@/hooks/hooks";
import { useState } from "react";
import {
  getRoleAvatarFallback,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";

interface Props {
  name: string;
  rating: number;
  feedback: string;
  imageUrl: string;
  date: string;
  Comment?: string;
  replyPersonProfileURL?: string;
}

const TPReviewFeedbackCard = (props: Props) => {
  const [viewReply, setViewReply] = useState(false);
  const toggleViewReply = () => {
    setViewReply(!viewReply);
  };
  return (
    <div className="flex w-full items-start justify-between gap-16 border-b border-[#EEF2F6] pb-20 last:border-b-0 last:pb-0">
      <div className="h-[52px] max-h-[52px] min-h-[52px] min-w-[52px] max-w-[52px]">
        <img
          className="h-full w-full rounded-full object-cover"
          src={resolveProfileImageSrc(
            props.imageUrl,
            getRoleAvatarFallback("sp")
          )}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              getRoleAvatarFallback("sp");
          }}
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
          <div className="flex flex-col ">
            <PrimaryTypo
              typo={props.name}
              styles="poppins-semibold !text-[13px]"
            />
            <div className="">
              <Rating
                value={props.rating}
                onChange={() => {}}
                size={20}
                isToDisplay={true}
              />
            </div>
          </div>

          <div>
            <span className="poppins-medium text-[12px] text-[#7D7D7D] opacity-40">
              {getDateValue(props.date)}
            </span>
          </div>
        </div>

        {props.feedback ? (
          <div className="mt-16 ">
            <PrimaryTypo
              typo={props.feedback}
              styles="poppins-medium !text-[12px] opacity-40 max-w-[864px]"
            />
          </div>
        ): (
          <></>
        )}

        {props.Comment ? (
          <>
            {!viewReply && (
              <div className="hover:cursor-pointer hover:text-[#7D7D7D] duration-500 flex gap-8">
                <img src={Vector} alt="vector" />
                <span
                  className="poppins-medium text-[12px] mt-4"
                  onClick={() => {
                    toggleViewReply();
                  }}
                >
                  View Reply
                </span>
              </div>
            )}
            {viewReply && (
              <>
                <div className="hover:cursor-pointer mt-3 flex gap-8">
                  <img
                    src={resolveProfileImageSrc(
                      props.replyPersonProfileURL,
                      getRoleAvatarFallback("sp")
                    )}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        getRoleAvatarFallback("sp");
                    }}
                    className="h-[27px] w-[27px] rounded-full object-cover"
                    alt=""
                  />
                  <span className="text-[12px] mt-4">{props.Comment}</span>
                </div>
                <div className="hover:cursor-pointer hover:text-[#7D7D7D] duration-500 flex gap-8">
                  <img src={Vector} alt="vector" />
                  <span
                    className="poppins-medium text-[12px] mt-4"
                    onClick={() => {
                      toggleViewReply();
                    }}
                  >
                    Hide Reply
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TPReviewFeedbackCard;
