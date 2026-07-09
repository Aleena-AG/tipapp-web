import { useState } from "react";
import { useGetAllActiveFAQs, FAQItem } from "@/api/faqs";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";

interface FAQ {
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

type GroupedFAQs = Record<string, FAQItem[]>;

const FAQsContainer = () => {
  const { data: activeFAQs } = useGetAllActiveFAQs();
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  const toggleFAQ = (faqId: number) => {
    setExpandedFAQs((prevState) =>
      prevState.includes(faqId)
        ? prevState.filter((id) => id !== faqId)
        : [...prevState, faqId]
    );
  };

  const groupedFAQs = activeFAQs?.reduce((acc: GroupedFAQs, faq: FAQ) => {
    const category = faq.faqCategory?.name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <div className="sm:bg-white max-w-[1200px] mx-auto rounded-lg px-38 pt-10 h-fit pb-20">
      {groupedFAQs ? (
        Object.keys(groupedFAQs).map((category) => (
          <div key={category}>
            <div className="pt-8 mb-20 mt-40">
              <PrimaryTypo typo={category} styles="text-xl font-bold mb-4 " />
            </div>
            <ul>
              {groupedFAQs[category].map((faq: FAQ, index: number) => (
                <li
                  key={faq.id}
                  className={`bg-white border border-gray-300 ${
                    index === 0 ? "rounded-t-lg" : ""
                  } ${
                    index === groupedFAQs[category].length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  <div
                    className="flex items-center justify-between pr-22 cursor-pointer"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <PrimaryTypo
                      typo={faq.title}
                      styles="font-bold text-md pl-18 py-11"
                    />
                    {expandedFAQs.includes(faq.id) ? (
                      <IoMdArrowDropup className="w-6 h-6" />
                    ) : (
                      <IoMdArrowDropdown className="w-6 h-6" />
                    )}
                  </div>
                  {expandedFAQs.includes(faq.id) && (
                    <>
                      <hr className="border-t border-gray-300 my-0" />
                      <div
                        className={`bg-[#F3F2F2] px-4 py-4 border-gray-300 ${
                          index === groupedFAQs[category].length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        <div
                          className={`font-medium text-[#6F6F6F] text-sm pl-18 py-13 ${
                            index === 0 ? "rounded-t-lg" : ""
                          }`}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: faq.description,
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <SecondaryTypo typo="No FAQs available"/>
      )}
    </div>
  );
};

export default FAQsContainer;
