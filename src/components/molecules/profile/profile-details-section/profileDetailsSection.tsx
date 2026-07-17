/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileDetailCard } from "@/components/atoms/cards/profile-detail-card/profileDetailCard";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import { truncateEmail } from "@/hooks/hooks";
import { useTranslation } from "react-i18next";

interface Props {
  email: string;
  address: string;
  phone: string;
  DateOfBirth: any;
  country: string;
  bankName: string;
  ibanNumber: string;
  name: string;
  lname: string;
  bio: string;
  imageUrl: string;
  city: string;
  whatsapp: string;
  accNumber?: string;
  role: string;
}

export const ProfileDetailsSection = (props: Props) => {
  const { t } = useTranslation();
  const roleType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const isSp = roleType === "sp";
  const accent = isSp ? "#d71921" : "#0B538D";
  const softBg = isSp
    ? "bg-[#FDECED] dark:bg-[#d71921]/25"
    : "bg-[#E8F2FA] dark:bg-[#0B538D]/30";
  /** Dull gold ring for profile avatar */
  const goldRing =
    "ring-[#E8B923] ring-offset-2 ring-offset-white dark:ring-[#E8B923] dark:ring-offset-[#0a1629]";

  const roleLabel =
    props.role === "sp" || (props.role === "both" && isSp)
      ? t("userSelection.serviceProvider")
      : t("userSelection.tipper");

  const fullName = [props.name, props.lname]
    .filter((part) => part && part !== "Not provided yet" && part.trim())
    .join(" ");

  return (
    <div className="flex flex-col gap-24 py-8">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-12 text-center">
        <div
          className={`relative h-[120px] w-[120px] overflow-hidden rounded-full ring-[3px] ${goldRing} shadow-[0_8px_24px_rgba(232,185,35,0.25)] sm:h-[140px] sm:w-[140px] dark:shadow-[0_8px_24px_rgba(232,185,35,0.2)]`}
        >
          <SafeImage
            src={props.imageUrl}
            alt="profile picture"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <h2 className="poppins-semibold text-[20px] text-[#0B2C4A] dark:text-white sm:text-[22px]">
            {fullName || "—"}
          </h2>
          <span
            className={`poppins-medium rounded-full px-12 py-4 text-[11px] sm:text-[12px] ${softBg}`}
            style={{ color: accent }}
          >
            {roleLabel}
          </span>
          {props.bio && props.bio !== "Not provided yet" && (
            <p className="poppins-regular max-w-[420px] text-[13px] leading-[20px] text-[#5A6A7A] dark:text-slate-400 sm:text-[14px] sm:leading-[22px]">
              {props.bio}
            </p>
          )}
        </div>
      </div>

      {/* Personal info */}
      <section className="rounded-[14px] border border-[#E4EAF2] border-l-[4px] border-l-[#0B538D] bg-card p-16 shadow-[0_6px_20px_rgba(11,83,141,0.06)] sm:p-20 dark:border-white/10 dark:bg-[#0a1629]/80 dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
        <h3 className="poppins-semibold mb-14 text-[15px] text-[#0B2C4A] dark:text-white sm:mb-16 sm:text-[16px]">
          {t("profile.personalInformation")}
        </h3>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <ProfileDetailCard
            title={t("forms.firstName")}
            detail={props.name ? props.name : " "}
          />
          <ProfileDetailCard
            title={t("forms.lastName")}
            detail={props.lname ? props.lname : " "}
          />
          <ProfileDetailCard
            title="Date of Birth"
            detail={props.DateOfBirth ? props.DateOfBirth : " "}
          />
          <ProfileDetailCard
            title="Bio"
            detail={props.bio ? props.bio : " "}
            size="short"
            maxLength={80}
          />
        </div>
      </section>

      {/* Contact info */}
      <section className="rounded-[14px] border border-[#E4EAF2] border-l-[4px] border-l-[#d71921] bg-card p-16 shadow-[0_6px_20px_rgba(11,83,141,0.06)] sm:p-20 dark:border-white/10 dark:bg-[#0a1629]/80 dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
        <h3 className="poppins-semibold mb-14 text-[15px] text-[#0B2C4A] dark:text-white sm:mb-16 sm:text-[16px]">
          {t("profile.contactInformation")}
        </h3>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <ProfileDetailCard
            title={t("forms.email")}
            detail={props.email ? truncateEmail(props.email) : " "}
          />
          <ProfileDetailCard
            title={t("forms.phoneNumber")}
            detail={props.phone ? props.phone : " "}
          />
          <ProfileDetailCard
            title="WhatsApp"
            detail={props.whatsapp ? props.whatsapp : " "}
          />
          <ProfileDetailCard
            title="Address"
            detail={props.address ? props.address : " "}
          />
          <ProfileDetailCard
            title={t("forms.country")}
            detail={props.country ? props.country : " "}
          />
          <ProfileDetailCard
            title={t("forms.city")}
            detail={props.city ? props.city : " "}
          />
        </div>
      </section>
    </div>
  );
};
