import TPQRCodeContainer from "@/components/organisms/tip-provider/TP-QR-CodeContainer/TPQRCodeContainer";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";

const TPHomeScreen = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere pb-80 pt-[72px] lg:pb-48 lg:pt-32">
      <PageAmbientBackground />

      <div className="relative z-10">
        <TPQRCodeContainer />
      </div>
    </div>
  );
};

export default TPHomeScreen;
