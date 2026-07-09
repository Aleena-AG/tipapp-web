import { useTranslation } from "react-i18next";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/utils/constants/FooterData";

const AppleGlyph = () => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 19 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M9.17338 6.372C8.29738 6.372 6.94138 5.376 5.51338 5.412C3.62938 5.436 1.90138 6.504 0.929378 8.196C-1.02662 11.592 0.425378 16.608 2.33338 19.368C3.26938 20.712 4.37338 22.224 5.83738 22.176C7.24138 22.116 7.76938 21.264 9.47338 21.264C11.1654 21.264 11.6454 22.176 13.1334 22.14C14.6454 22.116 15.6054 20.772 16.5294 19.416C17.5974 17.856 18.0414 16.344 18.0654 16.26C18.0294 16.248 15.1254 15.132 15.0894 11.772C15.0654 8.964 17.3814 7.62 17.4894 7.56C16.1694 5.628 14.1414 5.412 13.4334 5.364C11.5854 5.22 10.0374 6.372 9.17338 6.372ZM12.2934 3.54C13.0734 2.604 13.5894 1.296 13.4454 0C12.3294 0.048 10.9854 0.744 10.1814 1.68C9.46138 2.508 8.83738 3.84 9.00538 5.112C10.2414 5.208 11.5134 4.476 12.2934 3.54Z"
      fill="#ffffff"
    />
  </svg>
);

const PlayGlyph = () => (
  <svg
    width="16"
    height="18"
    viewBox="0 0 24 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path d="M1.6 0.6C1.3 0.9 1.1 1.4 1.1 2v22c0 .6.2 1.1.5 1.4L13.4 13 1.6.6z" fill="#34D399" />
    <path d="M18.1 8.7L4.5 0.9C4.2.7 3.9.6 3.6.6L15.1 12l3-3.3z" fill="#60A5FA" />
    <path d="M18.1 17.3l-3-3.3L3.6 25.4c.3 0 .6-.1.9-.3l13.6-7.8z" fill="#F87171" />
    <path d="M18.1 8.7L15.1 12l3 3.3 4-2.3c.9-.5.9-1.7 0-2.2l-4-2.1z" fill="#FBBF24" />
  </svg>
);

const StoreBadge = ({
  href,
  glyph,
  top,
  bottom,
}: {
  href: string;
  glyph: React.ReactNode;
  top: string;
  bottom: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex h-10 min-w-[128px] items-center gap-2 rounded-lg border border-white/10 bg-gradient-to-b from-[#1c1c22] to-[#0b0b0f] px-3 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50"
  >
    {glyph}
    <span className="flex flex-col items-start leading-none rtl:items-end">
      <span className="poppins-regular text-[9px] uppercase tracking-wide text-white/60">
        {top}
      </span>
      <span className="poppins-semibold text-[13px] leading-tight">{bottom}</span>
    </span>
  </a>
);

const DownloadBadges = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-nowrap items-center gap-2">
      <StoreBadge
        href={APP_STORE_URL}
        glyph={<AppleGlyph />}
        top={t("footer.download.iosTop")}
        bottom={t("footer.download.iosBottom")}
      />
      <StoreBadge
        href={PLAY_STORE_URL}
        glyph={<PlayGlyph />}
        top={t("footer.download.androidTop")}
        bottom={t("footer.download.androidBottom")}
      />
    </div>
  );
};

export default DownloadBadges;
