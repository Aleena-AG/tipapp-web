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
  value?: string;
  onChange?: (value: string) => void;
}

export const Dropdown = (props: Props) => {
  return (
    <>
      <Select value={props.value} onValueChange={props.onChange}>
        <SelectTrigger className={`${props.style}`}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option: string, index: number) => (
            <SelectGroup key={index}>
              <SelectItem value={option}>{option}</SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
