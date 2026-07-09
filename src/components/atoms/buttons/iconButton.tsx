/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";

interface Props {
  typo: string;
  styles?: string;
  type: "button" | "submit" | "reset";
  handleOnClick: () => void;
  isLoading?: boolean;
  isDisable?: boolean;
  icon?: string | JSX.Element | any;
}

export const IconButton = (props: Props) => {
  return (
    <Button
      type={props?.type}
      className={`${props?.styles}`}
      onClick={props?.handleOnClick}
      disabled={props?.isDisable}
    >
      
      <img src={props?.icon ? props?.icon : ""} alt="button icon" />
      {props.typo}
    </Button>
  );
};

// set defualt props
IconButton.defaultProps = {
  type: "button",
  styles: "",
  handleOnClick: () => {},
};
