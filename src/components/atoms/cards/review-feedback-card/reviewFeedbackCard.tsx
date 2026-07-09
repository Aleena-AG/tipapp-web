import { DEFAULT_PROFILE_IMAGE } from "@/utils/imageUtils";
import Rating from "../../rating/Rating";
import { PrimaryTypo } from "../../typo/primaryTypo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextInputSecondary from "../../textinput/textInput/TextInputSecondary";
// import { useState } from "react";
import { useAddComment } from "@/api/tipManagement";
import { useFormik } from "formik";
import * as Yup from "yup";
import Vector from "@/assets/svg/add-reply-vector.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import ToastProvider from "@/providers/ToastProvider";
import IconSend from "@/assets/svg/Send.svg";
import { useTranslation } from "react-i18next";
interface Props {
  id: number;
  name: string;
  rating: number;
  feedback: string;
  imageUrl: string;
  comment: string;
  isReplying: boolean;
  replyingId?: number | null;
  setReplyingId: (id: number | null) => void;
}

const ReviewFeedbackCard = (props: Props) => {
  const { t } = useTranslation();
  const { isReplying, setReplyingId } = props;
  const [isViewReply, setIsViewReply] = useState(false);
  const replyRef = useRef<HTMLDivElement>(null);

  const handleViewReply = () => {
    setIsViewReply(!isViewReply);
  };

  const { mutate: addComment, isLoading } = useAddComment(
    () => {
      ToastProvider.success("Comment added successfully");
      setReplyingId(null);
    },
    (error: string) => {
      ToastProvider.error(error);
    }
  );

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string()
        .max(255, "Comment must be 255 characters or less")
        .required("Comment is required"),
    }),
    onSubmit: (values) => {
      addComment({ TipId: props.id, Comment: values.comment });
      formik.resetForm();
    },
  });

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (replyRef.current && !replyRef.current.contains(event.target as Node)) {
      setReplyingId(null);
    }
  }, [setReplyingId]);

  useEffect(() => {
    if (isReplying) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isReplying, handleClickOutside]);

  return (
    <div className="flex items-start gap-16">
      <div className="min-w-[55px] max-w-[55px] h-[55px] max-h-[55px] min-h-[55px]">
        <Avatar className="h-[60px] w-[60px]">
          <AvatarImage
            src={props.imageUrl || DEFAULT_PROFILE_IMAGE}
            alt="@shadcn"
            className="w-full h-full object-cover"
          />
          <AvatarFallback>
            <img src={DEFAULT_PROFILE_IMAGE} alt="User Image" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
          <PrimaryTypo
            typo={props.name}
            styles="poppins-semibold !text-[13px] "
          />
          <div>
            <Rating
              value={props.rating}
              onChange={() => {}}
              size={20}
              isToDisplay={true}
            />
          </div>
        </div>
        <div>
          <PrimaryTypo
            typo={props.feedback}
            styles="poppins-medium !text-[12px] opacity-40"
          />
        </div>
        {props?.comment ? (
          <>
            {!isViewReply && (
              <div className="hover:cursor-pointer hover:text-[#7D7D7D] duration-500 flex gap-8">
                <img src={Vector} alt="vector" />
                <span
                  className="poppins-medium text-[12px] mt-4"
                  onClick={() => {
                    handleViewReply();
                  }}
                >
                  View Reply
                </span>
              </div>
            )}
            {isViewReply && (
              <div>
                <PrimaryTypo
                  typo={props.comment}
                  styles="poppins-medium !text-[12px]"
                />
                <div className="hover:cursor-pointer hover:text-[#7D7D7D] duration-500 flex gap-8">
                  <img src={Vector} alt="vector" />
                  <span
                    className="poppins-medium text-[12px] mt-4"
                    onClick={() => {
                      handleViewReply();
                    }}
                  >
                    Hide Reply
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {!props.isReplying && (
              <div className="hover:cursor-pointer hover:text-[#7D7D7D] duration-500 flex gap-8">
                <img src={Vector} alt="vector" />
                <span
                  className="poppins-medium text-[12px] mt-4"
                  onClick={() => {
                    props.setReplyingId(props.id);
                  }}
                >
                  {t("common.reply")}
                </span>
              </div>
            )}
            {props.isReplying && (
              <div ref={replyRef}>
                <div className="mt-16 flex items-center  lg:w-[500px] max-lg:w-full  gap-10  ">
                  <TextInputSecondary
                    placeholder={t("common.enterYourReply")}
                    containerStyles="max-w-[864px]"
                    inputStyles="poppins-medium !text-[12px] opacity-40"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="comment"
                    isError={
                      formik.touched.comment && Boolean(formik.errors.comment)
                    }
                    disabled={isLoading}
                  />
                  <button
                    className=""
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    disabled={isLoading}
                  >
                    <img src={IconSend} alt="Send Icon" className="w-7 h-7" />
                  </button>
                </div>
                <>
                  {formik.touched.comment && formik.errors.comment && (
                    <div className="text-red-500 text-xs">
                      {formik.errors.comment}
                    </div>
                  )}
                </>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewFeedbackCard;
