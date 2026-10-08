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

  const linkClass =
    "poppins-medium text-[12px] leading-4 text-[#5B6475] transition-colors hover:text-[#0B538D] dark:text-[#B7C7D9] dark:hover:text-white";

  return (
    <footer className="border-t border-[#E6EEF5] bg-white px-16 py-20 dark:border-white/10 dark:bg-[#0a1629] sm:px-24">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-16">
        <div className="flex w-full flex-col items-center gap-14 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-10">
            <img
              src={appLogo}
              alt="TipTapp"
              className="h-[44px] w-[44px] rounded-[12px] object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="poppins-semibold text-[15px] text-[#0B2B4E] dark:text-white">
                TipTapp
              </span>
              <span className="poppins-regular text-[12px] text-[#8A93A0]">
                {t("footer.tagline")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10">
            <DownloadBadges />
            {FooterSocialMediaIcons.map((icon, index) => (
              <Link
                key={index}
                to={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#0A66C2] transition-colors hover:bg-[#084e96]"
              >
                <img
                  src={icon.icon ?? LinkedInIcon}
                  alt=""
                  className="h-[18px] w-[18px] [filter:brightness(0)_invert(1)]"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-12 border-t border-[#E6EEF5] pt-16 text-center dark:border-white/10">
          <span className="poppins-medium text-[12px] text-[#8A93A0]">
            {t("footer.copyright")}
          </span>
          <nav className="flex max-w-[720px] flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <Link
              to="/view-more/newsletter"
              onClick={() => window.scrollTo(0, 0)}
              className={linkClass}
            >
              {t("footer.moreFromTipTapp.newsletters")}
            </Link>
            {attachedDocuments.map((document) => (
              <Link
                key={document.name}
                to={document.href}
                onClick={() => window.scrollTo(0, 0)}
                className={linkClass}
              >
                {t(document.name)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
