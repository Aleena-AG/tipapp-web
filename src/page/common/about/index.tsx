import React from "react";
import { GetFooterManagementDetails } from "@/api/footer-details";

interface ChildItem {
  id: number;
  name: string;
  content: string;
  updatedAt: string;
}

interface Section {
  id: number;
  name: string;
  content: string | null;
  updatedAt: string;
  children: ChildItem[];
}

const AboutUs: React.FC = () => {
  const { data } = GetFooterManagementDetails();

  // Find the "ABOUT" section
  const aboutSection = data?.find(
    (section: Section) => section.name === "ABOUT"
  );

  // Get only the "About Us" item from the children
  const aboutUsItem = aboutSection?.children.find(
    (item: { name: string; }) => item.name === "About Us"
  );

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className={`rounded-16 sm:bg-white min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col ${roleClassesBorder}`}>
          <h1 className="text-[28px] text-black font-[600]">About Us</h1>
          {aboutUsItem ? (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: aboutUsItem.content || "No content available",
                }}
              />
            </div>
          ) : (
            <p>About Us content not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
