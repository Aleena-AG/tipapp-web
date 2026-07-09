/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import TextArea from "@/components/atoms/textinput/textArea/TextArea";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { useSubmitContact } from "@/api/contact";
import toast from "react-hot-toast";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string()
    .min(10, "At least 10 characters")
    .required("Message is required"),
});

const ContactForm: React.FC = () => {
  const { mutate, isLoading } = useSubmitContact(
    () => toast.success("Thanks! We will get back to you shortly."),
    (err) => toast.error(err)
  );

  {/* Color role handling */ }
  const role = typeof window !== "undefined" ? localStorage.getItem("userType") : null; // "tp" | "sp" | null
  const roleClassesBorder =
    role === "tp"
      ? "sm:border sm:border-[#0B538D] sm:shadow-[0_0_15px_0_rgba(11,83,141,0.5)]"
      : role === "sp"
        ? "sm:border sm:border-[#d71921] sm:shadow-[0_0_15px_0_rgba(215,25,33,0.5)]"
        : "";


  return (
    <div className={`w-full rounded-16 bg-white shadow-xl p-20 lg:p-32 ${roleClassesBorder}`}>
      <h2 className="text-[20px] lg:text-[24px] font-[600] text-black mb-16">
        Send us a message
      </h2>
      <Formik
        initialValues={{ name: "", email: "", message: "" }}
        validationSchema={schema}
        onSubmit={(values, { resetForm }) => {
          mutate(values as any, {
            onSuccess: () => {
              resetForm();
            },
          });
        }}
      >
        {() => (
          <Form className="grid grid-cols-1 gap-16">
            <TextInput
              name="name"
              label="Name"
              isRequired
              placeholder="Your name"
            />
            <TextInput
              name="email"
              type="email"
              label="Email"
              isRequired
              placeholder="you@example.com"
            />
            <TextArea
              name="message"
              label="Message"
              isRequired
              rows={6}
              placeholder="How can we help?"
            />
            <div className="flex justify-end">
              <PrimaryButton
                type="submit"
                typo={isLoading ? "Sending..." : "Send Message"}
                styles={"text-white px-24"}
                handleOnClick={() => { }}
                isDisable={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
