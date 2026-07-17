import EmailIcon from "@/assets/svg/email.svg";
import PasswordIcon from "@/assets/svg/password.svg";
import GoogleIcon from "@/assets/svg/google.svg";
import AppleIcon from "@/assets/svg/apple.svg";
import FacebookIcon from "@/assets/svg/facebook.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import { useTranslation } from "react-i18next";
import { useSignUp } from "@/api/authApi";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";
import AuthLayout from "@/components/organisms/auth/authLayout/AuthLayout";

const SignupContainer = () => {
  const { t } = useTranslation();
  const { mutate: signUp, isLoading } = useSignUp();
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.required")),
    password: Yup.string()
      .min(8, t("auth.passwordTooShort"))
      .required(t("auth.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("auth.passwordsMustMatch"))
      .required(t("auth.required")),
  });

  const handleSubmit = (values: typeof initialValues) => {
    signUp({
      email: values.email,
      password: values.password,
    });
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleFacebookSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/facebook`;
  };

  const handleAppleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/apple`;
  };

  return (
    <AuthLayout>
      <h1 className="poppins-semibold text-[24px] sm:text-[28px] text-center leading-tight">
        {t("auth.createAccount")}
      </h1>
      <p className="poppins-regular text-app-muted text-sm text-center mt-2">
        {t("auth.loginSubtitle")}
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="mt-6 sm:mt-8 flex flex-col">
            <TextInput
              name="email"
              label={t("forms.email")}
              labelStyles="text-[#333] mb-1 inline-block"
              placeholder={t("auth.emailPlaceholder")}
              iconLeft={<img src={EmailIcon} alt="" />}
            />

            <div className="mt-5">
              <TextInput
                name="password"
                type="password"
                label={t("forms.password")}
                labelStyles="text-[#333] mb-1 inline-block"
                placeholder={t("auth.passwordPlaceholder")}
                iconLeft={<img src={PasswordIcon} alt="" />}
              />
            </div>

            <div className="mt-5">
              <TextInput
                name="confirmPassword"
                type="password"
                label={t("forms.confirmPassword")}
                labelStyles="text-[#333] mb-1 inline-block"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                iconLeft={<img src={PasswordIcon} alt="" />}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-7 w-full h-12 rounded-8 bg-[#9E2A2B] hover:bg-[#861f20] transition-colors text-white text-base poppins-medium disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading ? <SpinLoaderButton isLoading={true} /> : t("auth.signUp")}
            </button>

            <div className="flex w-full items-center justify-center gap-4 my-5 sm:my-7">
              <div className="h-px w-full bg-[#E4E4E4]" />
              <span className="text-app-muted text-sm poppins-medium">
                {t("auth.or")}
              </span>
              <div className="h-px w-full bg-[#E4E4E4]" />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAppleSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={AppleIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithApple")}
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={FacebookIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithFacebook")}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-8 border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors poppins-medium text-sm"
              >
                <img src={GoogleIcon} alt="" className="h-5 w-5" />
                {t("auth.continueWithGoogle")}
              </button>
            </div>

            <div className="flex w-full items-center justify-center gap-2 mt-6 sm:mt-8">
              <span className="text-app-muted text-sm poppins-medium">
                {t("auth.alreadyHaveAccount")}
              </span>
              <a
                href="/sign-in"
                className="text-[#9E2A2B] underline text-sm poppins-medium"
              >
                {t("auth.signInHere")}
              </a>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default SignupContainer;
