import SPOverallRatingSection from "@/components/organisms/tip-provider/SP-Overall-Rating-Container/SPOverallRatingContainer";

const SPOverallRatingPage = () => {
  const spID = localStorage.getItem("ServiceProviderID");

  return (
    <div className="min-h-screen bg-[#F8F7FF] px-16 pb-64 pt-[84px] sm:px-24 lg:px-32 lg:pt-40">
      <SPOverallRatingSection userID={spID ?? ""} />
    </div>
  );
};

export default SPOverallRatingPage;
