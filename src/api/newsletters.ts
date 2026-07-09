/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "react-query";
import authFetch from "./axiosInterceptor";

export const useAddNewsLetterSubscriber = (
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await authFetch.post("/newsletter-subscribers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_newsletter_subscribers"]);
      onSuccess();
    },
    onError: (error) => {
      //@ts-expect-error access error
      onError(error?.response?.data?.message);
    },
  });
};
