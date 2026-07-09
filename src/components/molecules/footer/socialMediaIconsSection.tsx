import { SocialMediaIcons } from "@/components/atoms/footer/socialMediaIcons";
import {
  FooterSocialMediaIcons,
} from "@/utils/constants/FooterData";
import { useTranslation } from "react-i18next";

const SocialMediaIconsSection = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-40 lg:flex-row w-full justify-between items-start lg:items-center pt-22 pb-17 border-b border-b-[#C8C8C8]">
      <div className="poppins-medium text-sm leading-5 text-[#6F6F6F]">
        {t("footer.copyright")}
      </div>
      <div className="flex flex-col gap-40 sm:flex-row sm:gap-40 items-start sm:items-center">
        <div className={`flex items-start sm:items-center gap-6`}>
          {FooterSocialMediaIcons.map((icon, index) => (
            <SocialMediaIcons key={index} href={icon.href} icon={icon.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaIconsSection;
