import React from "react";
import ContactHero from "@/components/molecules/common/ContactHero";
import ContactForm from "@/components/organisms/common/ContactForm";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";
import { Heart } from "lucide-react";

const ContactUsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere pb-80 pt-80">
      <PageAmbientBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col gap-24 px-20 sm:gap-28 sm:px-24">
        <ContactHero />
        <ContactForm />

        <div className="ta-animate-fade ta-delay-7 flex items-center justify-center gap-14 pb-8">
          <span className="h-px w-[64px] border-t border-dashed border-[#C5CED8] sm:w-[100px] dark:border-slate-600" />
          <p className="poppins-regular flex items-center gap-6 text-[12px] text-[#6B7A8A] sm:text-[13px] dark:text-slate-400">
            <Heart className="h-[13px] w-[13px] fill-[#d71921] text-[#d71921]" />
            Thank you for being part of the TipApp community.
          </p>
          <span className="h-px w-[64px] border-t border-dashed border-[#C5CED8] sm:w-[100px] dark:border-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
