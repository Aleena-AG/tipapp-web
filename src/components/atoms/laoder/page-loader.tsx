import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";
import Logo from "@/assets/images/appLogo.png";

interface PageLoaderProps {
  message?: string;
}

const PageLoader = ({ message }: PageLoaderProps) => {
  const { t } = useTranslation();
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const accentColor = userType === "tp" ? "#0B538D" : "#9E2A2B";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-primary-hex px-6">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-6 rounded-2xl bg-white px-10 py-12 shadow-xl">
        <img src={Logo} alt="Tip App" className="h-11 w-auto" />
        <ClipLoader
          color={accentColor}
          loading
          size={48}
          speedMultiplier={0.85}
          aria-label="Loading"
        />
        <p className="text-center text-sm text-gray-500 poppins-medium">
          {message ?? t("common.loading")}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
