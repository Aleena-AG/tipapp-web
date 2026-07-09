import { useState } from "react";
import {
  DEFAULT_PROFILE_IMAGE,
  resolveProfileImageSrc,
} from "@/utils/imageUtils";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

/** Renders `src` with automatic fallback when the URL fails or is a legacy Firebase URL. */
export function SafeImage({
  src,
  fallbackSrc = DEFAULT_PROFILE_IMAGE,
  onError,
  alt = "",
  ...props
}: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const resolved = useFallback
    ? fallbackSrc
    : resolveProfileImageSrc(src, fallbackSrc);

  return (
    <img
      {...props}
      alt={alt}
      src={resolved}
      onError={(event) => {
        if (!useFallback) setUseFallback(true);
        onError?.(event);
      }}
    />
  );
}
