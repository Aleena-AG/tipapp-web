import TPQRCodeContainer from "@/components/organisms/tip-provider/TP-QR-CodeContainer/TPQRCodeContainer";

const TPHomeScreen = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EFF1FB] pb-80 pt-[72px] lg:pb-48 lg:pt-32">
      {/* Decorative background waves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-64 -top-52 h-[640px] w-[640px] rounded-full bg-[#D5DBF1] blur-[60px]" />
        <div className="absolute -bottom-56 -left-40 h-[680px] w-[900px] rounded-[46%] bg-[#D3DEF2] blur-[60px]" />
        <div className="absolute -right-48 top-10 h-[680px] w-[680px] rounded-full bg-[#D2E1F2] blur-[70px]" />
        <div className="absolute bottom-4 right-1/4 h-[480px] w-[760px] rounded-[46%] bg-[#DBE0F3] blur-[60px]" />
        <div className="absolute right-16 top-1/3 h-[320px] w-[320px] rounded-full bg-[#D8E2F1] blur-[50px]" />
      </div>

      <div className="relative">
        <TPQRCodeContainer />
      </div>
    </div>
  );
};

export default TPHomeScreen;
