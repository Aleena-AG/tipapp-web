/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Lottie from "lottie-react";

interface Props {
  animationData: object;
}

const ContactHero: React.FC<Props> = ({ animationData }) => {
  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";

  return (
    <div className={`w-full rounded-16 bg-white shadow-xl px-20 lg:px-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${roleClassesBorder}`}>
      <div className="order-2 lg:order-1 ">
        <h1 className="text-[28px] lg:text-[32px] font-[700] text-black mb-8">
          Get in Touch
        </h1>
        <p className="text-[14px] lg:text-[16px] text-gray-600 leading-7">
          Questions about tipping, withdrawals, or your account? We’re here to
          help. Our team supports both Service Providers and Tippers across web
          and mobile.
        </p>
      </div>
      <div className="order-1 lg:order-2 w-full max-w-[480px] mx-auto">
        <Lottie animationData={animationData as any} loop autoplay />
      </div>
    </div>
  );
};

export default ContactHero;
