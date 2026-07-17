import { Button } from "@/components/ui/button";

interface Props {
  typo: React.ReactNode;
  styles?: string;
  type?: "button" | "submit" | "reset";
  handleOnClick?: () => void;
  isLoading?: boolean;
  isDisable?: boolean;
}

export const PrimaryButton = ({
  typo,
  styles = "",
  type = "button",
  handleOnClick = () => { },
  isDisable,
}: Props) => {


  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null

  const roleClassesButton =
    role === "tp"
      ? "bg-[#0B538D] hover:bg-[#0077B6] text-white dark:bg-[#0B538D] dark:hover:bg-[#0077B6] dark:text-white"
      : role === "sp"
        ? "bg-[#9E2A2B] hover:bg-[#ce260b] text-white dark:bg-[#9E2A2B] dark:hover:bg-[#ce260b] dark:text-white"
        : "";

  return (
    <Button
      type={type}
      className={`${roleClassesButton} ${styles}`}
      onClick={handleOnClick}
      disabled={isDisable}
    >
      {typo}
    </Button>
  );
};
