// import FacebookIconBlack from "../../assets/svg/facebookblackicon.svg";
// import TwitterIcon from "../../assets/svg/twitter.svg";
// import InstagramIcon from "../../assets/svg/instagram.svg";
// import youTubeIcon from "../../assets/svg/youtube.svg";
import LinkedInIcon from "../../assets/svg/linkedin.svg";

// TODO: replace the Android package id with the real Play Store listing once published.
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/tip-app/id6557064561";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tipapp";

export const FooterData = [
  {
    title: "footer.moreFromTipApp.title",
    links: [
      { typo: "footer.moreFromTipApp.newsletters", href: "/view-more/newsletter" },
      { typo: "footer.moreFromTipApp.downloadForiOS", href: APP_STORE_URL, blank: true },
      { typo: "footer.moreFromTipApp.downloadForAndroid", href: PLAY_STORE_URL, blank: true },
      // { typo: "footer.moreFromTipApp.magazine", href: "/magazine" },
      // { typo: "footer.moreFromTipApp.mobileApps", href: "/mobile-apps" },
      // { typo: "footer.moreFromTipApp.research", href: "/research" },
    ],
  },
];

export const FooterSocialMediaIcons = [
  { href: "https://www.linkedin.com/company/tip-tapp-the-tipping-app/", icon: LinkedInIcon }
  // { href: "https://www.facebook.com/", icon: FacebookIconBlack },
  // { href: "https://www.instagram.com/", icon: InstagramIcon },
  // { href: "https://www.twitter.com/", icon: TwitterIcon },
  // { href: "https://www.youtube.com/", icon: youTubeIcon },
];

export const currencies = ["AED", "EUR", "GBP", "USD"];

export const attachedDocuments = [
  {
    name: "footer.documents.trustAndSafety",
    href: "/policy",
  },
  {
    name: "footer.documents.termsOfUse",
    href: "/policy",
  },
  {
    name: "footer.documents.privacyPolicy",
    href: "/policy",
  },
  {
    name: "footer.documents.cookiePolicy",
    href: "/policy",
  },
  {
    name: "footer.documents.accessibilityStatement",
    href: "/privacy",
  },
  {
    name: "footer.documents.caNoticeOfConsent",
    href: "/privacy",
  },
];

export const UserData = [
  {
    name: "Sandy Smith",
    date: "10.05.21",
    amount: "AED 10.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Floyd Miles",
    date: "03.05.21",
    amount: "AED 20.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Anna Russell",
    date: "30.04.21",
    amount: "AED 15.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Wade Warren",
    date: "25.04.21",
    amount: "AED 10.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "John Doe",
    date: "22.04.21",
    amount: "AED 12.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Jane Doe",
    date: "19.04.21",
    amount: "AED 18.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Paul Green",
    date: "15.04.21",
    amount: "AED 14.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Linda Brown",
    date: "12.04.21",
    amount: "AED 25.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Chris Black",
    date: "08.04.21",
    amount: "AED 30.00",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    name: "Patricia White",
    date: "05.04.21",
    amount: "AED 22.00",
    imageUrl: "https://via.placeholder.com/50",
  },
];
