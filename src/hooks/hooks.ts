/* eslint-disable @typescript-eslint/no-explicit-any */
export const truncateEmail = (email: string) => {
  if (email.length <= 10) return email;

  const atIndex = email.indexOf("@");
  if (atIndex === -1 || atIndex <= 8) return email;

  const namePart = email.substring(0, 5);
  const domainPart = email.substring(atIndex);
  return `${namePart}.....${domainPart}`;
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
 export const getDateValueFormated = (dateInput: string): string => {
   const inputDate = new Date(dateInput);

   const options: Intl.DateTimeFormatOptions = {
     year: "2-digit",
     month: "2-digit",
     day: "2-digit",
   };

   const formatter = new Intl.DateTimeFormat("en-US", options);
   const parts = formatter.formatToParts(inputDate);

   const month = parts.find((part) => part.type === "month")?.value || "";
   const day = parts.find((part) => part.type === "day")?.value || "";
   const year = parts.find((part) => part.type === "year")?.value || "";

   return `${day}.${month}.${year}`;
 };

   export const getDateValue = (dateInput: string) => {
     const inputDate = new Date(dateInput);

     const options: any = {
       year: "numeric",
       month: "numeric",
       day: "numeric",
       // hour: "numeric",
       // minute: "numeric",
       /* second: "numeric",
         timeZoneName: "short" */
     };

      
     return inputDate.toLocaleDateString("en-US", options);
   };


  export const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };