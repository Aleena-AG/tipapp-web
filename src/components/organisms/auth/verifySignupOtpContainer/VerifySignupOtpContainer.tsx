import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/organisms/auth/authLayout/AuthLayout";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import ToastProvider from "@/providers/ToastProvider";
import { useResendSignupOTP, useVerifySignupOTP } from "@/api/authApi";

const OTP_LENGTH = 6;

const VerifySignupOtpContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | null)?.email;
  const email = emailFromState || localStorage.getItem("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifySignupOtp, isLoading } = useVerifySignupOTP();
  const { mutate: resendSignupOtp, isLoading: isResending } =
    useResendSignupOTP();

  useEffect(() => {
    if (!email) {
      ToastProvider.error(t("auth.signupOtpMissingEmail"));
      navigate("/sign-up", { replace: true });
    }
  }, [email, navigate, t]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      if (!digits.length) return;
      const next = [...otp];
      digits.forEach((digit, offset) => {
        if (index + offset < OTP_LENGTH) {
          next[index + offset] = digit;
        }
      });
      setOtp(next);
      const focusIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== OTP_LENGTH) {
      ToastProvider.error(t("auth.enterCompleteOtp"));
      return;
    }

    const password = sessionStorage.getItem("pendingSignupPassword") || "";
    if (!password) {
      ToastProvider.error(t("auth.signupOtpSessionExpired"));
      navigate("/sign-up", { replace: true });
      return;
    }

    verifySignupOtp({
      email,
      otp: enteredOtp,
      password,
    });
  };

  const handleResend = () => {
    if (!email) {
      ToastProvider.error(t("auth.signupOtpMissingEmail"));
      return;
    }
    resendSignupOtp({ email });
  };

  return (
    <AuthLayout>
      <button
        type="button"
        onClick={() => navigate("/sign-up")}
        className="mb-4 flex items-center gap-1 text-sm poppins-medium text-app-muted hover:text-app transition-colors"
      >
        ← {t("buttons.back")}
      </button>

      <h1 className="poppins-semibold text-[24px] sm:text-[28px] text-center leading-tight">
        {t("auth.verifyYourEmail")}
      </h1>
      <p className="poppins-regular text-app-muted text-sm text-center mt-2">
        {t("auth.signupOtpSubtitle")}
      </p>
      {email && (
        <p className="poppins-medium text-app text-sm text-center mt-2 break-all">
          {email}
        </p>
      )}
      <p className="poppins-regular text-app-muted text-xs text-center mt-2">
        {t("auth.otpValidFor10Minutes")}
      </p>

      <div className="mt-8 flex justify-between gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={`signup-otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={OTP_LENGTH}
            className="h-12 w-11 sm:h-14 sm:w-12 rounded-8 border border-[#E4E4E4] text-center text-lg poppins-semibold text-app focus:outline-none focus:border-[#9E2A2B] focus:ring-2 focus:ring-[#9E2A2B]/15 transition-colors"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => {
              e.preventDefault();
              handleOtpChange(index, e.clipboardData.getData("text"));
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading}
        className="mt-7 w-full h-12 rounded-8 bg-[#9E2A2B] hover:bg-[#861f20] transition-colors text-white text-base poppins-medium disabled:opacity-60 flex items-center justify-center"
      >
        {isLoading ? (
          <SpinLoaderButton isLoading={true} />
        ) : (
          t("auth.verifyAndContinue")
        )}
      </button>

      <p className="text-center mt-5 text-sm text-app-muted poppins-regular">
        {t("auth.didntGetOtp")}{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-[#9E2A2B] poppins-medium hover:underline disabled:opacity-60"
        >
          {isResending ? t("auth.resendingOtp") : t("auth.resendOtp")}
        </button>
      </p>
    </AuthLayout>
  );
};

export default VerifySignupOtpContainer;
