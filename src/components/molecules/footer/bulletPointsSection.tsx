/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetFooterManagementDetails } from "@/api/footer-details";
import BulletPoints from "@/components/atoms/footer/bulletPoints";
import BulletPointsHeading from "@/components/atoms/footer/bulletPointsHeading";
import { FooterData } from "@/utils/constants/FooterData";
import { useTranslation } from "react-i18next";

export const BulletPointsSection = () => {
  const { t } = useTranslation();
  const { data } = GetFooterManagementDetails();
  const apiSections = Array.isArray(data) ? data : [];
  const hiddenFooterItems = new Set([
  t("footer.about.ourCharter"),
  t("footer.about.stats"),
  t("footer.about.press"),
  t("footer.about.jobs"),
  t("footer.support.brandAssets"),
  ]);

  const isHiddenFooterItem = (name?: string) =>
    !!name && hiddenFooterItems.has(name.trim());

  return (
    <div className="flex flex-wrap gap-x-40 gap-y-16">
      {apiSections.map((section: any) => (
        <div
          key={section.id}
          className="flex flex-col gap-16 xl:mr-[160px] mr-5"
        >
          <BulletPointsHeading typo={section.name} />
          <div className="flex flex-col gap-8">
            {(Array.isArray(section.children) ? section.children : [])
              .filter((link: any) => !isHiddenFooterItem(link.name))
              .map((link: any, idx: number) => (
              <BulletPoints
                key={idx}
                typo={link.name}
                href={`/view-more/${link.id}`}
              />
            ))}
          </div>
        </div>
      ))}
      {FooterData.map((section: any, sectionIdx: number) => (
        <div
          key={sectionIdx}
          className="flex flex-col gap-16 xl:mr-[160px] mr-5"
        >
          <BulletPointsHeading typo={t(section.title)} />
          <div className="flex flex-col gap-8">
            {section.links.map((link: any, linkIdx: number) => (
              <BulletPoints
                key={linkIdx}
                typo={t(link.typo)}
                href={link.href}
              />
            ))}
          </div>
        </div>
      ))}

      {/* {FooterData.map((section: any) => (
        <div
          key={section.id}
          className="flex flex-col gap-16 xl:mr-[160px] mr-5"
        >
          <BulletPointsHeading typo={section.name} />
          <div className="flex flex-col gap-8">
            {section.children.map((link: any, idx: number) => (
              <BulletPoints
                key={idx}
                typo={link.name}
                href={`/bullet-point/${link.id}`}
              />
            ))}
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default BulletPointsSection;
