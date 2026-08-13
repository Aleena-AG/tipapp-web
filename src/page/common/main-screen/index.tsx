import { LandingHero } from "./LandingHero";
import { LandingIntro } from "./LandingIntro";
import { LandingHowItWorks } from "./LandingHowItWorks";
import { LandingEveryone } from "./LandingEveryone";
import { LandingWallet } from "./LandingWallet";
import { LandingSecure } from "./LandingSecure";
import { LandingFooter } from "./LandingFooter";

const MainScreen = () => {
  return (
    <div className="min-h-full" style={{ backgroundColor: "var(--landing-bg)" }}>
      <LandingHero />
      <LandingIntro />
      <LandingHowItWorks />
      <LandingWallet />
      <LandingEveryone />
      <LandingSecure />
      <LandingFooter />
    </div>
  );
};

export default MainScreen;
