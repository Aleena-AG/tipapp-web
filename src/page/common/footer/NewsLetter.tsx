import { useAddNewsLetterSubscriber } from "@/api/newsletters";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import SpinLoader from "@/components/atoms/laoder/spin-loader";
import ProfileEditTextInput from "@/components/atoms/textinput/textInput/ProfileEditTextInput";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import ToastProvider from "@/providers/ToastProvider";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const NewsLetter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userType");

  const { mutate: addNewsLetterSubscriber, isLoading } =
    useAddNewsLetterSubscriber(
      () => {
        ToastProvider.success(
          "You have successfully subscribed to our newsletter"
        );
        if (userRole === "sp") {
          navigate("/service-provider");
        } else if (userRole === "tp") {
          navigate("/tip-provider");
        } else if (userRole === "both") {
          navigate("/user-selection");
        } else {
          navigate("/sign-in");
        }
      },
      (error: string) => {
        ToastProvider.error(error);
      }
    );
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      addNewsLetterSubscriber(values);
      formik.resetForm();
    },
  });

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "sm:shadow-xl";


  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80 ">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className={`rounded-16 sm:bg-card min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 mt-8 flex flex-col ${roleClassesBorder}`}>
          <PrimaryTypo typo={"Newsletters"} styles={"!text-[28px] "} />
          <div className="text-center mt-[85px] mb-18 gap-18">
            <PrimaryTypo
              typo={
                "Subscribe to our Movie Newsletter and never miss latest updates!"
              }
            />
            <span className="">
              Get daily updates in your inbox, and keep updated with all the
              latest news from Hollywood. Your email will be safe and secure in
              our database.
            </span>
          </div>
          {isLoading ? (
            <>
              <div className="flex justify-center items-center gap-3 ">
                <span>{t("common.subscribing")}</span>
                <SpinLoader isLoading={isLoading} />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-12 w-full justify-center items-center mt-[60px]">
                <ProfileEditTextInput
                  placeholder="Full Name"
                  value={formik.values.fullName.toString()}
                  id={"fullName"}
                  name="fullName"
                  type="text"
                  containerStyles="max-w-[328px] min-w-[328px]"
                  onChange={formik.handleChange}
                  isError={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  errorMsg={formik.errors.fullName}
                  onBlur={formik.handleBlur}
                />
                <ProfileEditTextInput
                  placeholder="Email"
                  value={formik.values.email}
                  id={"email"}
                  name="email"
                  type="email"
                  containerStyles="max-w-[328px] min-w-[328px]"
                  onChange={formik.handleChange}
                  isError={formik.touched.email && Boolean(formik.errors.email)}
                  errorMsg={formik.errors.email}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="flex flex-col w-full justify-center items-center mt-12">
                <PrimaryButton
                  typo={`${isLoading ? t("common.subscribing") : "Subscribe"}`}
                  handleOnClick={() => {
                    formik.handleSubmit();
                  }}
                  styles="max-w-[328px] min-w-[328px]"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
