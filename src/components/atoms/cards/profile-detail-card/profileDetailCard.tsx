import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  detail: string;
  size?: "long" | "short";
  maxLength?: number;
}

export const ProfileDetailCard = (props: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = props.maxLength || props.detail.length;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (props.detail.length <= maxLength) {
      return props.detail;
    }

    if (isExpanded) {
      return (
        <>
          {props.detail}
          <span
            className="text-gray-400 ml-3 cursor-pointer "
            onClick={toggleExpand}
          >
            {t("common.showLess")}
          </span>
        </>
      );
    }

    return (
      <div className="flex flex-col">
        <span>{props.detail.slice(0, maxLength)}...</span>
        <span
          className="text-gray-400 cursor-pointer ml-1"
          onClick={toggleExpand}
        >
          {t("common.seeMore")}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col gap-4 break-words ${
        props.size === "short" && "sm:max-w-[240px]"
      } ${props.size === "long" && "max-w-full w-full"} `}
    >
      <div className="poppins-regular text-sm leading-normal">
        {props.title}
      </div>
      <div
        className={`${
          props.detail === "Not provided yet" ? "opacity-40" : ""
        } poppins-medium text-sm leading-normal`}
      >
        {props.detail ? renderText() : " "}
      </div>
    </div>
  );
};
