import TPReviewHistoryContainer from "@/components/organisms/tip-provider/TP-Review-History-Container/TPReviewHistoryContainer";

const UserReviewHistory = () => {
  return (
    <div className="min-h-screen bg-app-page px-16 pb-64 pt-[84px] sm:px-24 lg:px-32 lg:pt-40">
      <div className="mx-auto w-full max-w-[720px]">
        <TPReviewHistoryContainer />
      </div>
    </div>
  );
};

export default UserReviewHistory;
