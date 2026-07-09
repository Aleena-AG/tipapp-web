import { UserDataTypes } from "@/utils/types/types";
import User1 from "@/assets/svg/user1.svg";
import User2 from "@/assets/svg/user2.svg";
import User3 from "@/assets/svg/user3.svg";
import User4 from "@/assets/svg/user4.svg";
import { DEFAULT_PROFILE_IMAGE } from "@/utils/imageUtils";

/** Local placeholder — legacy Firebase e-hospital URLs are no longer billed/served. */
export const ProfileImage = DEFAULT_PROFILE_IMAGE;


export const UsersSampleData: UserDataTypes[] = [
  {
    name: "Sandy Smith",
    date: "10.05.21",
    amount: "AED 10.00",
    imageUrl: User1,
  },
  {
    name: "Floyd Miles",
    date: "03.05.21",
    amount: "AED 20.00",
    imageUrl: User2,
  },
  {
    name: "Anna Russell",
    date: "30.04.21",
    amount: "AED 15.00",
    imageUrl: User3,
  },
  {
    name: "Wade Warren",
    date: "25.04.21",
    amount: "AED 10.00",
    imageUrl: User4,
  },
  {
    name: "John Doe",
    date: "22.04.21",
    amount: "AED 12.00",
    imageUrl: User1,
  },
  {
    name: "Jane Doe",
    date: "19.04.21",
    amount: "AED 18.00",
    imageUrl: User2,
  },
  {
    name: "Paul Green",
    date: "15.04.21",
    amount: "AED 14.00",
    imageUrl: User3,
  },
  {
    name: "Linda Brown",
    date: "12.04.21",
    amount: "AED 25.00",
    imageUrl: User4,
  },
  {
    name: "Chris Black",
    date: "08.04.21",
    amount: "AED 30.00",
    imageUrl: User1,
  },
  {
    name: "Patricia White",
    date: "05.04.21",
    amount: "AED 22.00",
    imageUrl: User3,
  },
];


export const user = DEFAULT_PROFILE_IMAGE;