interface Props {
  styles?: string;
  placeholder?: string;
  iconLeft?: JSX.Element;
  containerStyles?: string;
  inputStyles?: string;
  isError?: boolean;
  type?: "text" | "number" | "email" | "password" | "tel";
  autoComplete?: string;
  errorMsg?: string;
  disabled?: boolean;
  label?: string;
  labelStyles?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
}

export const ProfileEditTextArea = (props: Props) => {
  return (
    <div className={`w-full ${props.containerStyles} flex flex-col gap-9`}>
      <div className="poppins-medium text-[14px]">{props.label}</div>
      <textarea
        className={`bg-[#FBFCFF] w-full min-h-[108px] max-h-[108px] rounded-8 border border-[#E0E0E0] outline-none px-15 py-10 placeholder:text-[14px] placeholder:poppins-medium placeholder:leading-normal placeholder:text-black ${props.inputStyles} placeholder:opacity-40`}
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        disabled={props.disabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        id={props.id}
      />
      {props.isError && (
        <div className="text-red-500 text-xs">{props.errorMsg}</div>
      )}
    </div>
  );
};
