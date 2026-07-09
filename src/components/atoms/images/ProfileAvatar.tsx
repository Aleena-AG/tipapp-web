import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PROFILE_IMAGE,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";

interface ProfileAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

export function ProfileAvatar({
  src,
  alt = "Profile",
  className,
  imageClassName,
}: ProfileAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={resolveProfileImageSrc(src)}
        alt={alt}
        className={imageClassName}
      />
      <AvatarFallback className="bg-muted p-0">
        <img
          src={DEFAULT_PROFILE_IMAGE}
          alt=""
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </AvatarFallback>
    </Avatar>
  );
}
