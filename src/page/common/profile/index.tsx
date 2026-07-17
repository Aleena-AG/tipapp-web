import ProfileContainer from "@/components/organisms/common/profileContainer/profileContainer";
import { PageAmbientBackground } from "@/components/molecules/common/PageAmbientBackground";

const index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app-atmosphere pb-80 pt-80">
      <PageAmbientBackground />

      <div className="relative z-10 mx-auto w-full max-w-[900px] px-20 sm:px-24">
        <ProfileContainer />
      </div>
    </div>
  );
};

export default index;
