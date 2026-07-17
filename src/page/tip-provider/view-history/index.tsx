import TPViewHistory from "@/components/organisms/tip-provider/TP-View-History-Container/TPViewHistory";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";

const ViewHistory = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere px-16 pb-96 pt-[84px] sm:px-32 lg:px-48 lg:pb-48 lg:pt-40">
      <PageAmbientBackground />
      <div className="relative z-10">
        <TPViewHistory />
      </div>
    </div>
  );
};

export default ViewHistory;


