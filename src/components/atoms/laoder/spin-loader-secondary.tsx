import BounceLoader from "react-spinners/ClipLoader";

const SpinLoaderButton = ({
  isLoading,

}: {
  isLoading: boolean;
  
}) => {
  return (
    <div className="flex justify-center items-center h-40 ">
      
      <BounceLoader
        color={"#ffffff"}
        loading={isLoading}
        size={24}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default SpinLoaderButton;