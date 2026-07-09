import { PrimaryTypo } from "../../typo/primaryTypo";
import Vector from "@/assets/svg/add-reply-vector.svg";
import Logo from "@/assets/images/appLogo.png";

interface Props {
  name?: string;
  rating?: number;
  message?: string;
  imageUrl?: string;
  date?: string;
  Comment?: string;
  replyPersonProfileURL?: string;
  richText?: string;
}

const NotificationsDetailCard = (props: Props) => {        
  return (
    <div>
      <div className="flex items-start justify-between w-full border-b border-[#D0D0D] pb-24 gap-16">
        <div className="min-w-[55px] max-w-[55px] h-[55px] max-h-[55px] min-h-[55px]">
          <img
            className="rounded-full object-cover w-full h-full"
            src={props.imageUrl ? props.imageUrl : Logo}
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-start flex-col">
              <PrimaryTypo
                typo={props.name ? props.name : "John Doe"}
                styles="poppins-semibold !text-[13px] "
              />
            </div>

            <div>
              <span className="poppins-medium text-[12px] text-[#7D7D7D] opacity-40">
                {props.date ? props.date : "2 days ago"}
              </span>
            </div>
          </div>

          <div className="mt-16">
            {props.richText ? (<>
              <div
                dangerouslySetInnerHTML={{
                  __html: props.message || 'No content available',
                }}
              />
            </>) : (<>

              <PrimaryTypo
                typo={props.message ? props.message : "No messages yet."}
                styles="poppins-medium !text-[12px] opacity-40 max-w-[864px]"
              />
            </>)}
          </div>
          {props.Comment ? (
            <>
              <div className="hover:cursor-pointer mt-3 flex gap-8">
                <img src={Vector} alt="vector" />
                <img
                  src={props.replyPersonProfileURL}
                  className="w-[27px] h-[27px] rounded-full"
                  alt=""
                />
                <span className="text-[12px] mt-4">{props.Comment}</span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

    </div>
  );
};

export default NotificationsDetailCard;