/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import authFetch from "./axiosInterceptor";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// Uses env var when available; falls back to the contact-us endpoint
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/contact-us";

export const useSubmitContact = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  return useMutation({
    mutationFn: async (data: ContactPayload) => {
      return await authFetch.post(CONTACT_ENDPOINT, data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      onError(error?.response?.data?.message || "Something went wrong");
    },
  });
};
