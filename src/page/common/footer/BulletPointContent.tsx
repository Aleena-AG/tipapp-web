/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { GetFooterManagementDetails } from "@/api/footer-details"; // Mock function to get details

export const BulletPointContent = () => {
  const { id } = useParams(); // Extract ID from route
  const { data } = GetFooterManagementDetails(); // Fetch all data

  // Find the section with the matching ID
  const selectedBulletPoint = data?.flatMap((section: any) =>
    section.children.filter((child: any) => child.id === Number(id))
  )[0];

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "sm:shadow-xl";
  
  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80 ">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className={`rounded-16 sm:bg-card min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col ${roleClassesBorder}`}>
          <h1 className="text-[28px] text-black font-[600]">{selectedBulletPoint?.name}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedBulletPoint?.content || "No content available",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BulletPointContent;
