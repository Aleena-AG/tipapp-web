interface Props {
  label?: string;
  containerStyles?: string;
  Styles?: string;
  placeholder?: string;
  onClick?: () => void;
  selected?: boolean;
  type?: "add-payment-details-btn" | "add-new-card-btn";
}

const AddPaymentDetailsButton = (props: Props) => {
   return (
     <div
       className={`w-full ${props.containerStyles} flex flex-col gap-9 minw-[229px] group`}
     >
       <div className="poppins-regular text-black text-sm leading-normal">
         {props.label}
       </div>
       <button
         className={`bg-[#FBFCFF] w-full min-h-[42px] max-h-[42px] rounded-8 border border-[#E0E0E0] outline-none px-15 py-10 placeholder:text-[14px] placeholder:poppins-medium placeholder:leading-normal placeholder:text-black ${props.Styles} flex items-center justify-between hover:border-black`}
         onClick={() => {
           props.onClick && props.onClick();
         }}
       >
         {props.type === "add-payment-details-btn" && (
           <span
             className={`${props.selected ? "text-black" : "text-[#A5A6A8]"}`}
           >
             {props.placeholder}
           </span>
         )}
         {props.type === "add-new-card-btn" && (
           <span className="group-hover:text-black text-[#A5A6A8]">
             Add New Card
           </span>
         )}
         {props.type === "add-payment-details-btn" && (
           <>
             {props.selected ? (
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="17"
                 height="17"
                 viewBox="0 0 17 17"
                 fill="none"
               >
                 <path
                   d="M8.25 0C3.69325 0 0 3.69325 0 8.25C0 12.8068 3.69325 16.5 8.25 16.5C12.8068 16.5 16.5 12.8068 16.5 8.25C16.5 3.69325 12.8068 0 8.25 0ZM8.25 15.125C4.45913 15.125 1.375 12.0409 1.375 8.25C1.375 4.45913 4.45913 1.375 8.25 1.375C12.0409 1.375 15.125 4.45913 15.125 8.25C15.125 12.0409 12.0409 15.125 8.25 15.125ZM4.125 8.25C4.125 8.7917 4.2317 9.3281 4.439 9.82857C4.6463 10.329 4.95014 10.7838 5.33318 11.1668C5.71623 11.5499 6.17096 11.8537 6.67143 12.061C7.1719 12.2683 7.7083 12.375 8.25 12.375C9.34402 12.375 10.3932 11.9404 11.1668 11.1668C11.9404 10.3932 12.375 9.34402 12.375 8.25C12.375 7.15598 11.9404 6.10677 11.1668 5.33318C10.3932 4.5596 9.34402 4.125 8.25 4.125C7.15598 4.125 6.10677 4.5596 5.33318 5.33318C4.5596 6.10677 4.125 7.15598 4.125 8.25Z"
                   fill="black"
                 />
               </svg>
             ) : (
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="17"
                 height="17"
                 viewBox="0 0 17 17"
                 fill="none"
               >
                 <path
                   d="M8.25 0C3.69325 0 0 3.69325 0 8.25C0 12.8067 3.69325 16.5 8.25 16.5C12.8067 16.5 16.5 12.8067 16.5 8.25C16.5 3.69325 12.8067 0 8.25 0ZM8.25 15.125C4.45913 15.125 1.375 12.0409 1.375 8.25C1.375 4.45913 4.45913 1.375 8.25 1.375C12.0409 1.375 15.125 4.45913 15.125 8.25C15.125 12.0409 12.0409 15.125 8.25 15.125Z"
                   fill="#E4E4E4"
                 />
               </svg>
             )}
           </>
         )}
         {props.type === "add-new-card-btn" && (
           <>
             <div className="group-hover:hidden block">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="17"
                 height="17"
                 viewBox="0 0 17 17"
                 fill="none"
               >
                 <path
                   d="M8.25 0C3.69325 0 0 3.69325 0 8.25C0 12.8067 3.69325 16.5 8.25 16.5C12.8067 16.5 16.5 12.8067 16.5 8.25C16.5 3.69325 12.8067 0 8.25 0ZM8.25 15.125C4.45913 15.125 1.375 12.0409 1.375 8.25C1.375 4.45913 4.45913 1.375 8.25 1.375C12.0409 1.375 15.125 4.45913 15.125 8.25C15.125 12.0409 12.0409 15.125 8.25 15.125Z"
                   fill="#E4E4E4"
                 />
               </svg>
             </div>
             <div className="hidden group-hover:block">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="17"
                 height="17"
                 viewBox="0 0 17 17"
                 fill="none"
               >
                 <path
                   d="M8.25 0C3.69325 0 0 3.69325 0 8.25C0 12.8068 3.69325 16.5 8.25 16.5C12.8068 16.5 16.5 12.8068 16.5 8.25C16.5 3.69325 12.8068 0 8.25 0ZM8.25 15.125C4.45913 15.125 1.375 12.0409 1.375 8.25C1.375 4.45913 4.45913 1.375 8.25 1.375C12.0409 1.375 15.125 4.45913 15.125 8.25C15.125 12.0409 12.0409 15.125 8.25 15.125ZM4.125 8.25C4.125 8.7917 4.2317 9.3281 4.439 9.82857C4.6463 10.329 4.95014 10.7838 5.33318 11.1668C5.71623 11.5499 6.17096 11.8537 6.67143 12.061C7.1719 12.2683 7.7083 12.375 8.25 12.375C9.34402 12.375 10.3932 11.9404 11.1668 11.1668C11.9404 10.3932 12.375 9.34402 12.375 8.25C12.375 7.15598 11.9404 6.10677 11.1668 5.33318C10.3932 4.5596 9.34402 4.125 8.25 4.125C7.15598 4.125 6.10677 4.5596 5.33318 5.33318C4.5596 6.10677 4.125 7.15598 4.125 8.25Z"
                   fill="black"
                 />
               </svg>
             </div>
           </>
         )}
       </button>
     </div>
   );
};

export default AddPaymentDetailsButton;
