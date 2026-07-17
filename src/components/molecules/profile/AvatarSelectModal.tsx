import { X } from "lucide-react";
import ProfileAvatarPicker from "@/components/molecules/profile/AvatarGenderPicker";
import {
  type AvatarGender,
  resolveAvatarDisplaySrc,
  toAvatarRelativePath,
} from "@/utils/constants/ProfileAvatars";
import { useEffect, useState } from "react";
import UploadIcon from "@/assets/svg/camera.svg";

type Props = {
  open: boolean;
  onClose: () => void;
  gender: AvatarGender;
  selectedUrl?: string;
  onConfirm: (url: string, gender: AvatarGender) => void;
  accentColor?: string;
  onUploadFile?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const AvatarSelectModal = ({
  open,
  onClose,
  gender,
  selectedUrl,
  onConfirm,
  accentColor = "#0B538D",
  onUploadFile,
}: Props) => {
  const [draftUrl, setDraftUrl] = useState(selectedUrl || "");
  const [draftGender, setDraftGender] = useState<AvatarGender>(gender);

  useEffect(() => {
    if (open) {
      setDraftUrl(selectedUrl || "");
      setDraftGender(gender);
    }
  }, [open, selectedUrl, gender]);

  const handleGenderChange = (next: AvatarGender) => {
    setDraftGender(next);
    // Gender is only for avatar filtering — clear selection when it no longer matches
    const relative = toAvatarRelativePath(draftUrl) || draftUrl;
    const matches =
      (next === "male" && relative.includes("/avatars/male/")) ||
      (next === "female" && relative.includes("/avatars/female/"));
    if (!matches) {
      setDraftUrl("");
    }
  };

  if (!open) return null;

  const previewSrc = resolveAvatarDisplaySrc(draftUrl);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-16">
      <button
        type="button"
        aria-label="Close avatar modal"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[20px] border border-[#E4EAF2] bg-card shadow-[0_20px_50px_rgba(11,83,141,0.22)] dark:border-white/10 dark:bg-[#0a1629] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-[#E8EEF5] px-20 py-16 dark:border-white/10">
          <div>
            <h2 className="poppins-semibold text-[18px] text-[#0B2C4A] dark:text-white">
              Choose profile photo
            </h2>
            <p className="poppins-regular mt-2 text-[12px] text-[#6B7A8A] dark:text-slate-400">
              Pick Male or Female to see matching avatars, then save.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F6FA] text-[#5A6A7A] transition hover:bg-[#E8EEF5] dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-20 py-18">
          <div className="mb-18 flex justify-center">
            <div className="flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full bg-[#EEF3F8] ring-[3px] ring-[#E8B923] ring-offset-2 ring-offset-white dark:bg-[#121e36] dark:ring-offset-[#0a1629]">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="poppins-medium px-8 text-center text-[11px] text-[#8A97A8]">
                  Preview
                </span>
              )}
            </div>
          </div>

          <ProfileAvatarPicker
            gender={draftGender}
            selectedUrl={draftUrl}
            onGenderChange={handleGenderChange}
            onSelectAvatar={setDraftUrl}
            accentColor={accentColor}
          />

          {onUploadFile ? (
            <label className="mt-18 flex cursor-pointer items-center justify-center gap-8 rounded-[12px] border border-dashed border-[#C9D5E4] bg-[#F8FAFC] px-14 py-14 text-[13px] text-[#5A6A7A] transition hover:border-[#0B538D]/40 dark:border-white/20 dark:bg-[#121e36] dark:text-slate-400 dark:hover:border-[#60A5FA]/40">
              <img src={UploadIcon} alt="" className="h-4 w-4" />
              <span className="poppins-medium">Or upload your own photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUploadFile}
              />
            </label>
          ) : null}
        </div>

        <div className="flex gap-10 border-t border-[#E8EEF5] px-20 py-16 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="poppins-medium h-11 flex-1 rounded-[12px] border border-[#D5DEE9] text-[14px] text-[#0B2C4A] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!draftUrl}
            onClick={() => {
              if (!draftUrl) return;
              onConfirm(draftUrl, draftGender);
              onClose();
            }}
            className="poppins-medium h-11 flex-1 rounded-[12px] text-[14px] text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            Save photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectModal;
