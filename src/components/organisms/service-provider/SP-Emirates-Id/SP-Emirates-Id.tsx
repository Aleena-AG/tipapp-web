 
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import EmailIcon from "@/assets/svg/email.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { spEmirateId } from "@/api/authApi";
import { useEffect, useState } from "react";
import ToastProvider from "@/providers/ToastProvider";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import EmiratesIDIcon from "@/assets/svg/Emirates_imag_id.svg";
import AddressIcon from "@/assets/svg/address.svg";
import BackIdIcon from "@/assets/svg/Back_ID.svg";
import FrontIdIcon from "@/assets/svg/Front_ID.svg";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import UploadConfirmationIcon from "@/assets/svg/UploadConfirmationIcon.svg";
const EmirateIDContainer = () => {
  const { isLoading, isSuccess, data, isError, error } = spEmirateId();
  const [IdUpload, setIdUpload] = useState<boolean>(true);
  const [uploadedImage] = useState<string | null>(null);
  const [UploadSuccessful, setUploadSuccessful] = useState<boolean>(false);

  const initialValues = {
    emirate: "",
    emirateid: "",
    expirydate: "",
  };

  const validationSchema = Yup.object({
    emirate: Yup.string().required("Required"),
    emirateid: Yup.string().required("Required"),
    expirydate: Yup.string().required("Required"),
  });

  const handleSubmit = () => {
    //to do databaind
    // mutate({
    //   emirate: values.emirate,
    //   emirateid: values.emirateid,
    //   expirydate: values.expirydate,
    // });
    setUploadSuccessful(true);
    setTimeout(() => {
      setUploadSuccessful(false);
    }, 3000);
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
      setUploadSuccessful(true);
      setTimeout(() => {
        setUploadSuccessful(false);
      }, 3000);
    }
  }, [isSuccess, data]);

  const [fileInputKey] = useState(0);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        try {
          //to do databaind
          const formData = new FormData();
          formData.append("file", file);
          // await uploadFile(formData);
        } catch (error) {
          ToastProvider.error("Failed to upload image. Please try again.");
        }
      };
      //to do databaind
    }
  };

  const handleIdUpload = () => {
    setIdUpload(false);
  };

  return (
    <>
      {IdUpload ? (
        <div className="md:bg-card max-w-[335px] md:max-w-[477px] md:min-w-[477px] mx-auto sm:px-[60px]  rounded-2xl py-[40px] px-[20px] flex flex-col justify-between sm:shadow-xl">
          <div className="flex flex-col">
            <PrimaryTypo
              typo="Emirates ID"
              styles="text-center !text-[19px] sm:text-[20px]"
            />
          </div>
          <div className=" flex justify-center items-center py-4 px-4 ">
            <img src={EmiratesIDIcon} alt="imageid" className=" mt-12" />
          </div>
          <div className="flex flex-col">
            <PrimaryTypo
              typo="Upload Your Emirates ID"
              styles="text-center !text-[14px] sm:text-[20px]"
            />
          </div>
          <div className="flex flex-col">
            <p className="  text-center mt-4 text-app-muted">
              Your Emirates ID is not updated in our sustem. Kindlyy upload your
              Emirates ID to keep using the tipping app services
            </p>
          </div>
          <div>
            <PrimaryButton
              typo="Upload Emirates ID"
              styles="w-full min-w-[280px] mt-[21px] !rounded-8 text-white text-base poppins-regular"
              type="submit"
              isLoading={isLoading}
              handleOnClick={handleIdUpload}
            />
          </div>
        </div>
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="md:bg-card max-w-[335px] md:max-w-[477px] md:min-w-[477px] mx-auto sm:px-[60px]  rounded-2xl py-[40px] px-[20px] flex flex-col justify-between sm:shadow-xl">
                <div className="flex flex-col">
                  <PrimaryTypo
                    typo="Emirates ID"
                    styles="text-center !text-[19px] sm:text-[20px]"
                  />
                </div>
                <div className="mt-[32px]">
                  <TextInput
                    name="emirate"
                    placeholder="Emirate"
                    inputStyles="w-[253px] !rounded-8"
                    iconLeft={<img src={AddressIcon} alt="email logo" />}
                  />
                </div>

                <div className="mt-[32px]">
                  <TextInput
                    name="emirateid"
                    placeholder="Emirates ID"
                    inputStyles="w-[253px] !rounded-8"
                    iconLeft={<img src={EmailIcon} alt="email logo" />}
                  />
                </div>
                <div className="mt-[32px]">
                  <TextInput
                    name="expirydate"
                    placeholder="Expiry Date"
                    inputStyles="w-[253px] !rounded-8"
                    iconLeft={<img src={EmailIcon} alt="email logo" />}
                  />
                </div>
                <div className="flex flex-col mt-[25px]  ">
                  <PrimaryTypo
                    typo="Upload Your Emirates ID"
                    styles=" !text-[12px]  sm:text-[20px]"
                  />
                </div>
                <div className=" flex  gap-10">
                  <div className="flex max-w-[330px] md:max-w-[184px]  lg:w-full max-lg:w-[200px] max-lg:h-[100px] md:h-[156px] bg-[#FBFCFF] py-[30px] mx-auto border-[1px] border-[#DBDBDB] rounded-[8px] justify-center items-center relative overflow-hidden">
                    <input
                      key={fileInputKey}
                      type="file"
                      // Frontend validation: HTML file type restriction - DISABLED
                      // accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        className="flex flex-col gap-[10px] justify-center items-center"
                      >
                        <img
                          src={FrontIdIcon}
                          alt="upload icon"
                          className="mr-2 "
                        />
                        <span className="text-app-muted text-sm poppins-medium leading-[21px]">
                          Front
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="flex max-w-[330px] md:max-w-[184px]  lg:w-full max-lg:w-[200px]  max-lg:h-[100px] md:h-[156px] bg-[#FBFCFF]  py-[30px] mx-auto border-[1px] border-[#DBDBDB] rounded-[8px] justify-center items-center relative overflow-hidden">
                    <input
                      type="file"
                      // Frontend validation: HTML file type restriction - DISABLED
                      // accept="image/*"
                      //onChange={handleFileUpload} //to do databaind
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        className="flex flex-col gap-[10px] justify-center items-center"
                      >
                        <img
                          src={BackIdIcon}
                          alt="upload icon"
                          className="mr-2 "
                        />
                        <span className="text-app-muted text-sm poppins-medium leading-[21px]">
                          Back
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-19 mt-[32px]">
                  <PrimaryButton
                    typo="Upload"
                    styles="w-full min-w-[280px] mt-[21px] !rounded-8 text-white text-base poppins-regular"
                    type="submit"
                    isLoading={isLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}

      <AlertDialog
        open={UploadSuccessful}
        // onOpenChange={setShowSignOutConfirmation} //to do databaind
      >
        <AlertDialogContent className="z-[9999]  w-full max-w-[350px] rounded-xl md:max-w-[200px] lg:max-w-[350px] lg:p-8">
          <div className="relative">
            <div className="absolute transform bg-card p-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 max-w-[84.363px] min-h-[84.363px] mih-h-[84.363px] max-h-[84.363px] h-full w-full rounded-full">
              <div className="bg-black h-full w-full rounded-full justify-center items-center flex">
                <img src={UploadConfirmationIcon} alt="Confirmation" />
              </div>
            </div>
          </div>
          <AlertDialogHeader className="pt-87  max-lg:pt-56 poppins-semibold text-[25px]  max-lg:text-[19px]  leading-normal text-center mb-40">
            <AlertDialogDescription className="text-black opacity-50 poppins-semibold text-[20px]  max-lg:text-[15px]  text-center max-w-[374px] mx-auto">
              Your Emirates ID is uploaded successfully
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmirateIDContainer;
