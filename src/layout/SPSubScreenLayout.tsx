import type { ReactNode } from "react";
import SPScreenBackground from "@/components/molecules/service-provider/sp-screen-background/SPScreenBackground";

interface SPSubScreenLayoutProps {
  children: ReactNode;
  maxWidth?: "md" | "lg";
  className?: string;
}

const maxWidthClasses = {
  md: "max-w-[663px]",
  lg: "max-w-[720px]",
};

const SPSubScreenLayout = ({
  children,
  maxWidth = "lg",
  className = "",
}: SPSubScreenLayoutProps) => (
  <div
    className={`relative min-h-screen overflow-x-hidden bg-primary-hex px-4 pb-28 pt-6 sm:px-8 sm:pt-10 lg:px-12 lg:pb-12 ${className}`}
  >
    <SPScreenBackground />
    <div className={`relative mx-auto w-full ${maxWidthClasses[maxWidth]}`}>
      {children}
    </div>
  </div>
);

export default SPSubScreenLayout;
