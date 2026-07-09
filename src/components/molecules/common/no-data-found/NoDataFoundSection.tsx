import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import NoDataFound from "@/assets/NoDataFound.png";
import { useTranslation } from "react-i18next";

const NoDataFoundSection = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="max-h-[300px] min-h-[300px] flex flex-col justify-center items-center sm:max-w-[400px] sm:min-w-[400px] m-auto">
        <img src={NoDataFound} alt="" className="w-full h-full object-cover" />
        <PrimaryTypo
          typo={t("common.noDataAvailableYet")}
          styles="!text-[20px] poppins-semibold text-center mt-4 opacity-40"
        />
      </div>
    </div>
  );
};

export default NoDataFoundSection;
