import { AttachedFiles } from "@/components/atoms/footer/attachedFiles";
import { attachedDocuments } from "@/utils/constants/FooterData";
import { useTranslation } from "react-i18next";

const InformationalContent = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-24 py-20">
      {attachedDocuments.map((document, index) => (
        <AttachedFiles
          key={index}
          href={document.href}
          typo={t(document.name)}
        />
      ))}
    </div>
  );
};

export default InformationalContent;
