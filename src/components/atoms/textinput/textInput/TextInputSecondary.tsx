interface Props {
  styles?: string;
  placeholder?: string;
  iconLeft?: JSX.Element;
  containerStyles?: string;
  inputStyles?: string;
  isError?: boolean;
  type?: "text" | "number" | "email" | "password" | "tel";
  autoComplete?: string;
  errorStyle?: string;
  disabled?: boolean;
  label?: string;
  labelStyles?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;

}

const TextInputSecondary = (props: Props) => {
  return (
    <div className={`w-full ${props.containerStyles}`}>
      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        className={`max-w-[467px] w-full min-h-[30px] max-h-[30px] rounded-8 border border-black outline-none px-14 py-6 placeholder:text-[12px] placeholder:poppins-medium placeholder:leading-[18px] placeholder:text-black ${props.inputStyles}`}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        name={props.name}
        disabled={props.disabled}
      />
      {props.isError && (
        <div className="text-red-500 text-xs">{props.errorStyle}</div>
      )}
    </div>
  );
};

export default TextInputSecondary;
