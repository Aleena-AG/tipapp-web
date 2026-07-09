/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileDetailCard } from "@/components/atoms/cards/profile-detail-card/profileDetailCard";
import { SafeImage } from "@/components/atoms/images/SafeImage";
import { truncateEmail } from "@/hooks/hooks";
import { useTranslation } from "react-i18next";
interface Props {
  // userName: string;
  email: string;
  address: string;
  phone: string;
  DateOfBirth: any;
  country: string;
  bankName: string;
  ibanNumber: string;
  name: string;
  lname: string;
  bio: string;
  imageUrl: string;
  city: string;
  whatsapp: string;
  accNumber?: string;
  //paypal?: string;
  role: string;
}

export const ProfileDetailsSection = (props: Props) => {
  const { t } = useTranslation();
  // const userType = localStorage.getItem("userType");
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:pt-46 sm:pb-31 py-20  ">
      <div className="flex justify-center mb-20">
        <SafeImage
          src={props.imageUrl}
          alt="profile picture"
          className="w-full h-full object-cover rounded-4 min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] sm:hidden block"
        />
      </div>
      <div className="flex flex-col w-full ">
        <div className="flex flex-row w-full justify-between gap-50">
          <div className="flex flex-col w-full gap-40">
            <div className="flex flex-row ">
              <div className="flex flex-[1]">
                {/* <ProfileDetailCard
                  title="User Name"
                  detail={props.userName ? props.userName : " "}
                /> */}
                <ProfileDetailCard
                  title={t("forms.firstName")}
                  detail={props.name ? props.name : " "}
                />
              </div>
              <div className="flex flex-[1] items-start">
                <ProfileDetailCard
                  title={t("forms.lastName")}
                  detail={props.lname ? props.lname : " "}
                />
              </div>
            </div>
            <div className="flex flex-row mb-50 ">
              <div className="flex flex-[1]">
                <ProfileDetailCard
                  title={t("forms.email")}
                  detail={props.email ? truncateEmail(props.email) : " "}
                />
              </div>
              <div className="flex flex-[1] items-start">
                <ProfileDetailCard
                  title="Bio"
                  detail={props.bio ? props.bio : " "}
                  size={"short"}
                  maxLength={41}
                />
              </div>
            </div>
          </div>
          <div className="min-w-[184px] min-h-[189px] max-w-[184px] max-h-[189px] hidden sm:block rounded-4 ">
            <div className="w-[189px] h-[189px] flex items-center justify-center overflow-hidden rounded-4">
              <SafeImage
                src={props.imageUrl}
                alt="profile picture"
                className="w-full h-full object-cover rounded-4"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-between gap-50 mb-50 ">
          <div className="flex flex-col w-full gap-40">
            <div className="flex flex-row ">
              <div className="flex flex-[1]">
                <ProfileDetailCard
                  title="Address"
                  detail={props.address ? props.address : " "}
                />
              </div>
              <div className="flex flex-[1] items-start">
                <ProfileDetailCard
                  title="Date of Birth"
                  detail={props.DateOfBirth ? props.DateOfBirth : " "}
                />
              </div>
            </div>
          </div>
          <div className="min-w-[184px] hidden sm:block rounded-4 " />
        </div>
        <div className="flex flex-row w-full justify-between gap-50">
          <div className="flex flex-col w-full gap-40">
            <div className="flex flex-row ">
              <div className="flex flex-[1]">
                <ProfileDetailCard
                  title={t("forms.phoneNumber")}
                  detail={props.phone ? props.phone : " "}
                />
              </div>
              <div className="flex flex-[1] items-start">
                <ProfileDetailCard
                  title="WhatsApp"
                  detail={props.whatsapp ? props.whatsapp : " "}
                />
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="flex flex-[1]">
                <ProfileDetailCard
                  title={t("forms.country")}
                  detail={props.country ? props.country : " "}
                />
              </div>
              <div className="flex flex-[1] items-start">
                <ProfileDetailCard
                  title={t("forms.city")}
                  detail={props.city ? props.city : " "}
                />
              </div>
            </div>
          </div>
          <div className="min-w-[184px] hidden sm:block rounded-4 " />
        </div>
        {/* <div className="flex flex-row w-full justify-between gap-50 mt-33 mb-46">
          <div className="flex flex-col w-full gap-40">
            <div className="flex flex-row ">
              <div className="flex flex-[1]">
                {props.role === "sp" && (
                  <>
                    <ProfileDetailCard
                      title="Bank Name"
                      detail={
                        props.bankName ? props.bankName : "Not provided yet"
                      }
                    />
                  </>
                )}
                {props.role === "both" && userType === "sp" && (
                  <>
                    <ProfileDetailCard
                      title="Bank Name"
                      detail={
                        props.bankName ? props.bankName : "Not provided yet"
                      }
                    />
                  </>
                )}

                {props.role === "tp" && (
                  <>
                    {props.accNumber && (
                      <ProfileDetailCard
                        title="Card Details"
                        detail={
                          props.accNumber ? props.accNumber : "Not provided yet"
                        }
                      />
                    )}
                  </>
                )}
                {props.role === "both" && userType === "tp" && (
                  <>
                    {props.accNumber && (
                      <ProfileDetailCard
                        title="Card Details"
                        detail={
                          props.accNumber ? props.accNumber : "Not provided yet"
                        }
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-[1] items-start">
                {props.role === "sp" && (
                  <>
                    <ProfileDetailCard
                      title="Account Number"
                      detail={
                        props.accNumber ? props.accNumber : "Not provided yet"
                      }
                    />
                  </>
                )}
                {props.role === "both" && userType === "sp" && (
                  <>
                    <ProfileDetailCard
                      title="Account Number"
                      detail={
                        props.accNumber ? props.accNumber : "Not provided yet"
                      }
                    />
                  </>
                )}

                {props.role === "tp" && (
//                  <>
//                    {props.paypal && (
///                      <ProfileDetailCard
//                        title="Paypal"
//                        detail={
//                          props.paypal
//                            ? truncateEmail(props.paypal)
//                            : "Not provided yet"
//                        }
//                      />
//</>                    )}
//                  </>
<></>
                )}
                 {props.role === "both" && userType === "tp" && (
//                  <>
//                     {props.paypal && (
//                       <ProfileDetailCard
//                         title="Paypal"
//                         detail={
//                           props.paypal
//                             ? truncateEmail(props.paypal)
//                             : "Not provided yet"
//                         }
//                       />
//                     )}
//                   </>
<></>
                )}
              </div>
            </div>
            {props.role === "sp" && (
              <>
                <div className="flex flex-row ">
                  <div className="flex flex-[1]">
                    <ProfileDetailCard
                      title="IBAN Number"
                      detail={
                        props.ibanNumber ? props.ibanNumber : "Not provided yet"
                      }
                    />
                  </div>
                  <div className="flex flex-[1] items-start">
                    <ProfileDetailCard
                      title="Paypal"
                      detail={
                        props.paypal
                          ? truncateEmail(props.paypal)
                          : "Not provided yet"
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {props.role === "both" && userType === "sp" && (
              <>
                <div className="flex flex-row ">
                  <div className="flex flex-[1]">
                    <ProfileDetailCard
                      title="IBAN Number"
                      detail={
                        props.ibanNumber ? props.ibanNumber : "Not provided yet"
                      }
                    />
                  </div>
                  <div className="flex flex-[1] items-start">
                    <ProfileDetailCard
                      title="Paypal"
                      detail={
                        props.paypal
                          ? truncateEmail(props.paypal)
                          : "Not provided yet"
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="min-w-[184px] hidden sm:block rounded-4 " />
        </div> */}
      </div>
    </div>
  );
};
