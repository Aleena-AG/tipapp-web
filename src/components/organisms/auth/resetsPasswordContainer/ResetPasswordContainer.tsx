import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import PasswordIcon from "@/assets/svg/password.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "@/api/authApi";
import { useEffect, useState } from "react";
import ToastProvider from "@/providers/ToastProvider";
import { useLocation, useNavigate } from "react-router-dom";
import SpinLoaderButton from "@/components/atoms/laoder/spin-loader-secondary";

const ResetPasswordContainer = () => {
  const { mutate, isLoading, isSuccess, data, isError, error } =
    useResetPassword();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const [showLoading, setShowLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setShowLoading(true);
    await mutate({
      newPassword: values.password,
      email,
      otp,
    });
    setShowLoading(false);
  };

  const handleBackClick = () => {
    navigate("/verify-otp", { state: { email } });
  };

  useEffect(() => {
    if (isError && error) {
      ToastProvider.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      ToastProvider.success(
        data.message || data.data.message || "Registration successfull!."
      );
    }
  }, [isSuccess, data]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="md:bg-white max-w-[477px] mx-auto sm:px-[60px] rounded-2xl py-[30px] px-[20px] flex flex-col justify-between sm:shadow-xl">
          <button
            onClick={handleBackClick}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center text-sm"
          >
            ← Back
          </button>
          <div className="flex flex-col ">
            <PrimaryTypo
              typo="Reset password"
              styles="text-center !text-[28px] sm:text-[20px]"
            />
          </div>

          <div className="mt-[32px]">
            <TextInput
              name="password"
              placeholder="Type your password"
              inputStyles="max-lg:w-[253px] lg:w-[450px]  !rounded-8"
              iconLeft={<img src={PasswordIcon} alt="password logo" />}
              type="password"
            />
          </div>
          <div className="mt-[32px]">
            <TextInput
              name="confirmPassword"
              placeholder="Confirm Password"
              inputStyles=" max-lg:w-[253px] lg:w-[450px]  rounded-8"
              iconLeft={<img src={PasswordIcon} alt="password logo" />}
              type="password"
            />
          </div>
          <div className="flex flex-col gap-19 mt-[30px]">
            <PrimaryButton
              typo={
                showLoading ? <SpinLoaderButton isLoading={true} /> : "Sign Up"
              }
              styles="w-full min-w-[280px] mt-[21px] !rounded-8 text-white text-base poppins-regular"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordContainer;
