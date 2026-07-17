import QrResultContainer from "@/components/organisms/service-provider/QR-Result/QrResultContainer";

const QrResultScreen = () => {
  return (
    <div className="flex min-h-screen flex-col bg-app-page">
      <div className="flex flex-1 items-start justify-center px-16 pb-32 pt-20 sm:px-24">
        <QrResultContainer />
      </div>
    </div>
  );
};

export default QrResultScreen;
