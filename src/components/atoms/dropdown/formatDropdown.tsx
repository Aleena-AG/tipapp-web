import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  style?: string;
  options: string[];
  placeholder?: string;
  formatOption?: (option: string) => string;
  onChange?: (selectedOption: string) => void;
  value?: string;
}

export const FormatDropdown = ({
  style,
  options,
  placeholder,
  formatOption,
  onChange,
  value,
}: Props) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange && onChange(value)}
    >
      <SelectTrigger className={`${style}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: string, index) => (
          <SelectGroup key={index}>
            <SelectItem value={option}>
              {formatOption ? formatOption(option) : option}
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
