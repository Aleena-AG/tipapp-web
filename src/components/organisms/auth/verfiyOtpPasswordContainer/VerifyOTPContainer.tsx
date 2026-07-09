import { useVerifyOTP, useForgotPassword } from "@/api/authApi";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import ToastProvider from "@/providers/ToastProvider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTPContainer = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const {
    mutate: verifyOTPMutate,
    isLoading,
    isSuccess,
    data,
    isError,
    error,
  } = useVerifyOTP();
  const {
    mutate: resendOTPMutate,
    isSuccess: isResendSuccess,
    data: resendData,
    isError: isResendError,
    error: resendError,
  } = useForgotPassword();
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleResetPassword = () => {
    const enteredOtp = otp.join("");
    verifyOTPMutate({
      otp: enteredOtp,
      email: email,
    });
  };

  useEffect(() => {
    if (isError && error) {
      ToastProvider.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error(
        "Verify OTP error:",
        error.response?.data?.message || error.message
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      ToastProvider.success(data.data.message || "OTP verified.");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isResendError && resendError) {
      ToastProvider.error(
        resendError.response?.data?.message ||
          "An error occurred. Please try again."
      );
      console.error(
        "Resend OTP error:",
        resendError.response?.data?.message || resendError.message
      );
    }
  }, [isResendError, resendError]);

  useEffect(() => {
    if (isResendSuccess && resendData) {
      ToastProvider.success(resendData.data.message || "OTP resent.");
    }
  }, [isResendSuccess, resendData]);

  const handleResendOtp = () => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      resendOTPMutate({ email });
    } else {
      ToastProvider.error("No email found to resend OTP.");
    }
  };

  const handleBackClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="max-w-md mx-auto lg:mt-[138px] mt-[60px] lg:mb-[155px] mb-[80px] lg:bg-white lg:px-[60px] pt-[46px] pb-[42px] p-8 rounded-lg sm:shadow-xl">
      <button
        onClick={handleBackClick}
        className="text-gray-600 hover:text-gray-800 mb-4 flex items-center text-sm"
      >
        ← Back
      </button>
      <h2 className="!text-[28px] sm:text-[20px] font-bold text-center">
        Reset Password
      </h2>
      <p className="text-center mt-[17px] text-gray-600 mb-6">
        We just sent a 6 digit OTP to your email.
        <br />
        Enter the code here to proceed.
      </p>

      {email && <p>Email: {email}</p>}
      <div className="flex justify-between mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            className="w-12 h-12 mt-[29px] text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
          />
        ))}
      </div>
      <button
        className="w-full mt-[29px] h-full max-h-[48px] max-w-[328px] bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300"
        onClick={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? <SpinLoaderButton isLoading={true} /> : "Reset Password"}
      </button>
      <p className="text-center mt-[15px] text-[14px] text-[#6F6F6F]">
        Didn't get an OTP?{" "}
        <button
          className="text-black font-semibold hover:underline"
          onClick={handleResendOtp}
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default VerifyOTPContainer;
