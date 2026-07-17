import { getCurrentDate } from "@/hooks/hooks";
import ToastProvider from "@/providers/ToastProvider";
import { useEffect } from "react";

interface Props {
  id?: string;
  styles?: string;
  placeholder?: string;
  iconLeft?: JSX.Element;
  containerStyles?: string;
  inputStyles?: string;
  isError?: boolean;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "date"
    | "number-without-arrows";
  autoComplete?: string;
  errorMsg?: string;
  disabled?: boolean;
  label?: string;
  labelStyles?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  helperText?: string;
  min?: string;
  max?: string;
}

const ProfileEditTextInput = (props: Props) => {
  const sendToast = () => {
    // send toast
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e);
      props.isError && sendToast();
    }
  };
  useEffect(() => {
    if (props.isError) {
      ToastProvider.error(
        props.errorMsg || "An error occurred. Please try again."
      );
    }
  }, [props.isError, props.errorMsg]);

  return (
    <>
      <div className={`w-full ${props.containerStyles} flex flex-col gap-9`}>
        <div className="poppins-regular text-foreground text-sm leading-normal">
          {props.label}
        </div>
        <input
          id={props.id}
          name={props.name}
          onChange={handleOnChange}
          value={props.value}
          type={props.type || "text"}
          placeholder={props.placeholder}
          className={`w-full min-h-[42px] max-h-[42px] rounded-8 border border-border bg-[#F8FAFC] outline-none focus:border-ring text-[#0B2C4A] px-15 py-10 placeholder:text-[14px] placeholder:poppins-medium placeholder:leading-normal placeholder:text-muted-foreground placeholder:opacity-40 dark:border-white/10 dark:bg-[#121e36] dark:text-white dark:focus:border-[#3B82F6] ${
            props.inputStyles
          } ${
            props.isError
              ? "border-red-500 placeholder:text-red-500 placeholder:opacity-100"
              : ""
          }`}
          onBlur={props.onBlur}
          disabled={props.disabled}
          min={props.min}
          max={
            props.max || (props.type === "date" ? getCurrentDate() : undefined)
          }
        />
        {props.helperText && (
          <div className="text-xs text-gray-500 -mt-2">{props.helperText}</div>
        )}
      </div>
    </>
  );
};

export default ProfileEditTextInput;
