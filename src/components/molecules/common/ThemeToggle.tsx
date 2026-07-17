import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "onColor";
  className?: string;
}

/** Simple icon toggle — no dropdown */
const ThemeToggle = ({ variant = "default", className }: ThemeToggleProps) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "onColor"
          ? "text-white hover:bg-white/15 focus-visible:ring-offset-[#0B538D]"
          : "text-[#0B538D] hover:bg-[#E8F2FA] focus-visible:ring-offset-background dark:text-[#93C5FD] dark:hover:bg-white/10",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={2} />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={2} />
      )}
    </button>
  );
};

export default ThemeToggle;
