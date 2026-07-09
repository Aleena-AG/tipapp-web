/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useState } from "react";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { Field, ErrorMessage, FieldInputProps } from "formik";
import { getCurrentDate } from "@/hooks/hooks";

interface TextInputProps {
  name: string;
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
  errorStyle?: string;
  disabled?: boolean;
  label?: string;
  labelStyles?: string;
  className?: string;
  isRequired?: boolean;
  helperText?: string;
  min?: string;
  max?: string;
}

const TextInput: FunctionComponent<TextInputProps> = ({
  name,
  placeholder = "",
  iconLeft,
  containerStyles = "",
  inputStyles = "",
  type = "text",
  autoComplete,
  errorStyle = "",
  labelStyles = "",
  disabled = false,
  isRequired,
  label,
  className,
  helperText,
  min,
  max,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    field: FieldInputProps<any>
  ) => {
    setIsFocused(false);
    field.onBlur(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (type === "number" || type === "tel" || type === "number-without-arrows")
    ) {
      const allowedKeys = [
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
        "Delete",
        "+",
        "(",
        ")",
        " ",
        "-",
      ];

      const isDigit = /[0-9]/.test(event.key);
      const isAllowedKey = allowedKeys.includes(event.key);
      // Allow modifier combos (copy/paste/select all, etc.)
      const isModifier = event.ctrlKey || event.metaKey || event.altKey;

      if (!isDigit && !isAllowedKey && !isModifier) {
        event.preventDefault();
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`poppins-medium text-[14px] ${labelStyles}`}>
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Field name={name}>
        {({ field, form }: { field: FieldInputProps<any>; form: any }) => (
          <div
            className={`flex flex-row items-center justify-center  ${containerStyles} border rounded-[7px] h-10   relative ${
              isFocused ? "border-black border-[2px]" : "border-gray-300"
            }`}
          >
            {iconLeft && (
              <div
                className="ml-[14px]  w-full min-w-4 max-w-4
               bg-white bg-bu rounded-[7px] flex items-center"
              >
                {iconLeft}
              </div>
            )}
            <input
              {...field}
              placeholder={placeholder}
              className={`h-full w-full text-input-font rounded-r-[7px] ${
                iconLeft ? "" : "rounded-l-[7px]"
              } !border-0 !border-transparent   bg-white px-[10px] py-2.5 font-sans text-base font-normal text-blue-gray-700 outline-none placeholder:text-custom-gray ${
                isFocused ? "focus:outline-none" : ""
              } ${inputStyles} ${
                type === "date" ? "date-input-no-calendar" : ""
              }`}
              type={showPassword ? "text" : type}
              min={min || (type === "number" ? 0 : undefined)}
              autoComplete={autoComplete}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={(event) => handleBlur(event, field)}
              onKeyDown={handleKeyDown}
              max={max || (type === "date" ? getCurrentDate() : undefined)}
              onChange={(e) => {
                field.onChange(e);
                if (field.name === "Phone") {
                  if (form.values.Whatsapp === form.values.Phone) {
                    form.setFieldValue("Whatsapp", "");
                  }
                }
              }}
            />
            {type === "password" && (
              <div
                className="cursor-pointer  right-0 mr-15 absolute"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <TbEye size={20} className=" bg-blue-300" />
                ) : (
                  <TbEyeClosed size={20} />
                )}
              </div>
            )}
          </div>
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className={`pt-0 text-sm text-red-700 -mb-3 ${errorStyle}`}
      />
      {helperText && (
        <div className="pt-1 text-xs text-gray-500 -mb-3">{helperText}</div>
      )}
    </div>
  );
};
export default TextInput;
