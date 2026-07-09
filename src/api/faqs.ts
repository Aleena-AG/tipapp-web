import { UseQueryResult, useQuery } from "react-query";
import authFetch from "./axiosInterceptor";

export interface FAQItem {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  faqCategory: {
    id: number;
    name: string;
    addedBy: string;
    status: string;
    orderType: number;
  };
}

export const useGetAllActiveFAQs = (): UseQueryResult<FAQItem[]> => {
  return useQuery({
    queryKey: ["get_active_faqs"],
    queryFn: async () => {
      const response = await authFetch.get(`/faqs/active-faqs`);
      return response.data;
    },
    select(data) {
      return data;
    },
  });
};
