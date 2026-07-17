/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent, useState } from "react";
import { Field, ErrorMessage, FieldInputProps } from "formik";

interface TextAreaProps {
  name: string;
  placeholder?: string;
  containerStyles?: string;
  inputStyles?: string;
  errorStyle?: string;
  disabled?: boolean;
  rows?: number;
  label?: string;
  isRequired?: boolean;
}

const TextArea: FunctionComponent<TextAreaProps> = ({
  name,
  placeholder = "Type here...",
  containerStyles = "",
  inputStyles = "",
  errorStyle = "",
  disabled = false,
  rows = 4,
  label,
  isRequired,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (
    event: React.FocusEvent<HTMLTextAreaElement>,
    field: FieldInputProps<any>
  ) => {
    setIsFocused(false);
    field.onBlur(event);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="poppins-medium text-[14px]">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Field name={name}>
        {({ field }: { field: FieldInputProps<any> }) => (
          <div
            className={`${containerStyles} rounded-lg border border-border bg-[#F8FAFC] dark:bg-[#121e36] dark:border-white/10 ${
              isFocused ? "ring-2 ring-ring/30 border-ring" : ""
            }`}
          >
            <textarea
              {...field}
              placeholder={placeholder}
              className={`w-full p-3 bg-transparent placeholder:text-opacity-40 text-[#0B2C4A] placeholder:text-muted-foreground text-base font-sans resize-none outline-none dark:text-white ${inputStyles}`}
              disabled={disabled}
              rows={rows}
              onFocus={handleFocus}
              onBlur={(event) => handleBlur(event, field)}
            />
          </div>
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className={`mt-1 text-sm text-red-600 ${errorStyle}`}
      />
    </div>
  );
};

export default TextArea;
