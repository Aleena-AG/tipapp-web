import React from "react";
import ContactHero from "@/components/molecules/common/ContactHero";
import ContactForm from "@/components/organisms/common/ContactForm";

// Lightweight inline animation JSON to avoid external fetches.
// You can replace this with a richer JSON later if desired.
const simpleDots = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 480,
  h: 320,
  nm: "dots",
  ddd: 0,
  assets: [],
  layers: [],
};

const ContactUsPage: React.FC = () => {
  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className="w-full max-w-[1080px] mx-70 flex flex-col gap-y-24 mt-8">
          <ContactHero animationData={simpleDots} />
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
