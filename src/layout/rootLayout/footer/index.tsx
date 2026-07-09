import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import appLogo from "@/assets/images/appLogo.png";
import LinkedInIcon from "@/assets/svg/linkedin.svg";
import DownloadBadges from "@/components/molecules/footer/downloadBadges";
import {
  attachedDocuments,
  FooterSocialMediaIcons,
} from "@/utils/constants/FooterData";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[#E4E0F2] bg-[#F3F1FB] px-4 pt-6 pb-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex shrink-0 items-center gap-3">
            <img
              src={appLogo}
              alt="Tip App"
              className="h-10 w-10 rounded-lg object-contain shadow-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="poppins-semibold whitespace-nowrap text-sm text-black">
                TIP APP
              </span>
              <span className="poppins-regular whitespace-nowrap text-[11px] text-[#6F6F6F]">
                {t("footer.tagline")}
              </span>
            </div>
          </div>

          {/* Download + social */}
          <div className="flex shrink-0 items-center gap-3">
            <DownloadBadges />
            {FooterSocialMediaIcons.map((icon, index) => (
              <Link
                key={index}
                to={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A66C2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={icon.icon ?? LinkedInIcon}
                  alt="LinkedIn"
                  className="h-5 w-5 [filter:brightness(0)_invert(1)]"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-5 flex flex-col items-center gap-2 border-t border-[#E4E0F2] pt-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="poppins-medium text-[11px] leading-4 text-[#8A879B]">
            {t("footer.copyright")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              to="/view-more/newsletter"
              onClick={() => window.scrollTo(0, 0)}
              className="poppins-medium text-[11px] leading-4 text-[#8A879B] transition-colors hover:text-[#1E4FA3]"
            >
              {t("footer.moreFromTipApp.newsletters")}
            </Link>
            {attachedDocuments.map((document, index) => (
              <span
                key={index}
                className="poppins-regular text-[11px] leading-4 text-[#8A879B] transition-colors hover:text-black"
              >
                {t(document.name)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
