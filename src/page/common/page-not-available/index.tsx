import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { handleScrollTop } from "@/hooks/hooks";
import SkeletonBody from "@/components/atoms/skeleton-body/SkeletonBody";
import { useTranslation } from "react-i18next";

const PageNotAvailable = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleScrollTop();
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowOverlay(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const userType = localStorage.getItem("userType");
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    return !!(token && userType);
  };

  const handleNavigation = (path: string) => {
    if (path === "home") {
      if (!isAuthenticated()) {
        navigate("/sign-in");
        return;
      }

      if (userType === "tp") {
        navigate("/tip-provider");
      } else if (userType === "sp") {
        navigate("/service-provider");
      } else if (userType === "both") {
        navigate("/user-selection");
      } else {
        navigate("/sign-in");
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className="rounded-16 sm:bg-card min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col sm:shadow-xl relative">
          {isLoading ? (
            <>
              <SkeletonBody />
            </>
          ) : null}
        </div>
      </div>
      <AlertDialog open={showOverlay} onOpenChange={setShowOverlay}>
        <AlertDialogContent className="w-full max-w-[250px] rounded-xl md:max-w-[500px] lg:max-w-[550px] lg:p-8">
          <AlertDialogHeader>
            <AlertDialogDescription className="pt-48 text-black opacity-50 poppins-semibold text-[20px]  max-lg:text-[15px]  text-center max-w-[374px] mx-auto">
              {t("common.weApologizeForTheInconvenience")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pt-30 flex flex-col gap-8 justify-center items-center mx-auto pb-46">
              <AlertDialogAction
                className="lg:min-w-[328px] max-lg:min-w-[200px] max-w-[328px] mih-h-[48px] max-h-[48px] rounded-8"
                onClick={() => {
                  handleNavigation("home");
                  setShowOverlay(false);
                }}
              >
                {t("common.backToHome")}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageNotAvailable;
