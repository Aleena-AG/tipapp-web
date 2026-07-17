import BounceLoader from "react-spinners/ClipLoader";

const SpinLoader = ({
  isLoading,
  isLoadingTextVisible,
}: {
  isLoading: boolean;
  isLoadingTextVisible?: boolean;
}) => {
  return (
    <div className="flex justify-center items-center h-40 sm:bg-app-surface">
      {isLoadingTextVisible && <span className="text-black ">Loading ...</span>}
      <BounceLoader
        color={"#000000"}
        loading={isLoading}
        size={24}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default SpinLoader;
