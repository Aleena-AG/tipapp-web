/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/atoms/textinput/textInput/TextInput";
import TextArea from "@/components/atoms/textinput/textArea/TextArea";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { useSubmitContact } from "@/api/contact";
import toast from "react-hot-toast";
import {
  Send,
  Mail,
  MessageCircle,
  Heart,
  Shield,
  Lock,
  type LucideIcon,
} from "lucide-react";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string()
    .min(10, "At least 10 characters")
    .required("Message is required"),
});

const supportPoints: {
  title: string;
  text: string;
  Icon: LucideIcon;
  accent: "blue" | "red";
}[] = [
  {
    Icon: Shield,
    title: "Fast & Reliable",
    text: "Quick responses when you need help most.",
    accent: "blue",
  },
  {
    Icon: Lock,
    title: "Secure & Private",
    text: "Your details stay safe with TipApp.",
    accent: "blue",
  },
  {
    Icon: Heart,
    title: "People First",
    text: "Real support from a team that cares.",
    accent: "red",
  },
];

const ContactForm: React.FC = () => {
  const { mutate, isLoading } = useSubmitContact(
    () => toast.success("Thanks! We will get back to you shortly."),
    (err) => toast.error(err)
  );

  return (
    <div className="ta-animate-slide-up ta-delay-5 overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-card shadow-[0_8px_28px_rgba(11,83,141,0.08)] dark:border-slate-700/80 dark:bg-slate-800/90 dark:shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <div className="border-b border-[#EEF2F6] p-18 sm:p-24 lg:border-b-0 lg:border-r dark:border-slate-700">
          <div className="mb-18 flex items-start gap-12">
            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#E8F2FA] dark:bg-[#0B538D]/30">
              <Send className="h-[18px] w-[18px] text-[#0B538D] dark:text-[#93C5FD]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="poppins-semibold text-[17px] text-[#0B2C4A] sm:text-[18px] dark:text-white">
                Send us a message
              </h2>
              <p className="poppins-regular mt-4 text-[12px] leading-[18px] text-[#6B7A8A] sm:text-[13px] dark:text-slate-400">
                Fill in the form and we’ll get back to you shortly.
              </p>
            </div>
          </div>

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
              <Form className="grid grid-cols-1 gap-14">
                <TextInput
                  name="name"
                  label="Name"
                  isRequired
                  placeholder="Your name"
                  labelStyles="text-app dark:text-slate-200"
                />
                <TextInput
                  name="email"
                  type="email"
                  label="Email"
                  isRequired
                  placeholder="you@example.com"
                  labelStyles="text-app dark:text-slate-200"
                />
                <TextArea
                  name="message"
                  label="Message"
                  isRequired
                  rows={5}
                  placeholder="How can we help?"
                />
                <div className="flex justify-end pt-4">
                  <PrimaryButton
                    type="submit"
                    typo={
                      <span className="inline-flex items-center gap-8">
                        <Send className="h-[14px] w-[14px]" strokeWidth={2.25} />
                        {isLoading ? "Sending..." : "Send Message"}
                      </span>
                    }
                    styles="!bg-[#0B538D] hover:!bg-[#0077B6] dark:!bg-[#2563EB] dark:hover:!bg-[#1D4ED8] !text-white px-20 h-[40px] rounded-[8px] poppins-medium shadow-[0_6px_16px_rgba(11,83,141,0.22)]"
                    handleOnClick={() => {}}
                    isDisable={isLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-18 bg-[#F8FBFE] p-18 sm:p-24 dark:bg-slate-900/70">
          <div className="relative mx-auto flex h-[88px] w-full max-w-[180px] items-center justify-center">
            <div className="ta-float absolute left-8 top-4 flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-[#0B538D] shadow-[0_8px_18px_rgba(11,83,141,0.28)] dark:bg-[#2563EB]">
              <Mail className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <div
              className="ta-float absolute right-10 top-0 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#E8F2FA] shadow-[0_6px_14px_rgba(11,83,141,0.14)] dark:bg-[#0B538D]/40"
              style={{ animationDelay: "0.8s" }}
            >
              <MessageCircle className="h-[16px] w-[16px] text-[#0B538D] dark:text-[#93C5FD]" strokeWidth={2} />
            </div>
            <div
              className="ta-float absolute bottom-2 right-16 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#d71921] shadow-[0_8px_16px_rgba(215,25,33,0.28)]"
              style={{ animationDelay: "1.4s" }}
            >
              <Heart className="h-[14px] w-[14px] text-white" strokeWidth={2} fill="white" />
            </div>
          </div>

          <div>
            <h3 className="poppins-semibold text-[16px] text-[#0B2C4A] dark:text-white">
              We&apos;re here for you
            </h3>
            <p className="poppins-regular mt-6 text-[12px] leading-[18px] text-[#6B7A8A] sm:text-[13px] sm:leading-[20px] dark:text-slate-400">
              Our support team is dedicated to helping Tippers and Service
              Providers get the most out of TipApp.
            </p>
          </div>

          <ul className="flex flex-col gap-12">
            {supportPoints.map(({ title, text, Icon, accent }) => {
              const isBlue = accent === "blue";
              return (
                <li key={title} className="flex items-start gap-10">
                  <span
                    className={`mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
                      isBlue
                        ? "bg-[#E8F2FA] dark:bg-[#0B538D]/30"
                        : "bg-[#FDECED] dark:bg-[#d71921]/20"
                    }`}
                  >
                    <Icon
                      className="h-[14px] w-[14px]"
                      style={{ color: isBlue ? "#0B538D" : "#d71921" }}
                      strokeWidth={2}
                    />
                  </span>
                  <div>
                    <p className="poppins-semibold text-[13px] text-[#0B2C4A] dark:text-white">
                      {title}
                    </p>
                    <p className="poppins-regular mt-2 text-[11px] leading-[16px] text-[#6B7A8A] sm:text-[12px] dark:text-slate-400">
                      {text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ContactForm;
