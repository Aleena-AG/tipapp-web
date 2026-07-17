import { Check } from "lucide-react";
import {
  type AvatarGender,
  getAvatarsForGender,
  resolveAvatarDisplaySrc,
  toAvatarRelativePath,
} from "@/utils/constants/ProfileAvatars";

type Props = {
  gender: AvatarGender;
  selectedUrl?: string;
  onGenderChange: (gender: AvatarGender) => void;
  onSelectAvatar: (url: string) => void;
  accentColor?: string;
};

const ProfileAvatarPicker = ({
  gender,
  selectedUrl,
  onGenderChange,
  onSelectAvatar,
  accentColor = "#0B538D",
}: Props) => {
  const avatars = getAvatarsForGender(gender);
  const selectedRelative = toAvatarRelativePath(selectedUrl) || selectedUrl || "";

  return (
    <div className="flex w-full flex-col gap-14">
      <div className="flex flex-col gap-8">
        <p className="poppins-semibold text-[13px] text-[#0B2C4A] dark:text-white sm:text-[14px]">
          Show avatars for
        </p>
        <div className="flex gap-10">
          {(["male", "female"] as AvatarGender[]).map((option) => {
            const active = gender === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onGenderChange(option)}
                className={`poppins-medium rounded-full px-16 py-8 text-[13px] transition-all ${
                  active
                    ? "text-white shadow-[0_6px_16px_rgba(11,83,141,0.22)]"
                    : "border border-[#D6E6F3] bg-white text-[#0B2C4A] hover:border-[#0B538D]/35 dark:border-white/15 dark:bg-[#121e36] dark:text-white dark:hover:border-[#60A5FA]/40"
                }`}
                style={active ? { backgroundColor: accentColor } : undefined}
              >
                {option === "male" ? "Male" : "Female"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <p className="poppins-semibold text-[13px] text-[#0B2C4A] dark:text-white sm:text-[14px]">
            Choose an avatar
          </p>
          <p className="poppins-regular mt-4 text-[12px] text-[#6B7A8A] dark:text-slate-400">
            {gender === "male"
              ? "Choose any male avatar you like."
              : "Choose any female avatar you like."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-12 sm:grid-cols-4 md:grid-cols-5">
          {avatars.map((avatar) => {
            const selected =
              !!selectedRelative &&
              (selectedRelative === avatar.path ||
                selectedRelative.includes(avatar.path));

            return (
              <button
                key={avatar.id}
                type="button"
                title={avatar.label}
                onClick={() => onSelectAvatar(avatar.path)}
                className={`group relative aspect-square overflow-hidden rounded-full border-2 bg-[#F4F7FB] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(11,83,141,0.14)] dark:bg-[#121e36] ${
                  selected ? "border-[#0B538D]" : "border-transparent"
                }`}
                style={
                  selected
                    ? {
                        borderColor: accentColor,
                        boxShadow: `0 0 0 3px ${accentColor}2E`,
                      }
                    : undefined
                }
              >
                <img
                  src={resolveAvatarDisplaySrc(avatar.path)}
                  alt={avatar.label}
                  className="h-full w-full object-cover"
                />
                {selected && (
                  <span
                    className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarPicker;
