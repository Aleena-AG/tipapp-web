import ScanIcon from "@/assets/svg/QRCode.svg";
import ReviewIcon from "@/assets/svg/review.svg";
import TipIcon from "@/assets/svg/tip-history.svg";
import PaymentIcon from "@/assets/svg/mastercard.svg";
import HistoryIcon from "@/assets/svg/tip-history.svg";
import ProfileIcon from "@/assets/svg/profile-icon.svg";

export const howItWorks = {
  web: {
    tipper: [
      {
        icon: ProfileIcon,
        title: "Sign in",
        description: "Log in or create an account to get started.",
      },
      {
        icon: ScanIcon,
        title: "Scan QR",
        description: "Tap Scan and point your camera at the QR code.",
      },
      {
        icon: ReviewIcon,
        title: "Review",
        description: "Check the service provider profile and details.",
      },
      {
        icon: TipIcon,
        title: "Rate & Tip",
        description: "Give a star rating, leave feedback and set tip amount.",
      },
      {
        icon: PaymentIcon,
        title: "Pay Securely",
        description: "Choose a saved card or add a new one and proceed.",
      },
      {
        icon: HistoryIcon,
        title: "History",
        description: "View your tips and reviews any time from history.",
      },
    ],
    serviceProvider: [
      {
        icon: ProfileIcon,
        title: "Sign in as Service Provider",
        description: "Access your dashboard to manage tips and reviews.",
      },
      {
        icon: ScanIcon,
        title: "Show QR",
        description: "Display or share your QR code with customers.",
      },
      {
        icon: TipIcon,
        title: "Receive Tips",
        description: "Customers scan and send tips with ratings.",
      },
      {
        icon: ReviewIcon,
        title: "See Reviews",
        description: "View ratings and feedback to improve your service.",
      },
      {
        icon: HistoryIcon,
        title: "Track Balance",
        description: "Monitor your total received tips and activity.",
      },
      {
        icon: PaymentIcon,
        title: "Withdraw",
        description: "Request withdrawals according to limits and policies.",
      },
    ],
  },
};
