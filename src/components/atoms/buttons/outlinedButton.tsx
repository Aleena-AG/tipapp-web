import { Button } from "@/components/ui/button";

interface Props {
  typo: string;
  styles?: string;
  handleOnClick: () => void;
}

export const OutlinedButton = (props: Props) => {
  return (
    <Button
      variant="outline"
      className={`${props.styles}`}
      onClick={props.handleOnClick}
    >
      {props.typo}
    </Button>
  );
};
