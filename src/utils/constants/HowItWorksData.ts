import type { LucideIcon } from "lucide-react";
import { HandCoins, QrCode, Star } from "lucide-react";

export type HowItWorksStepId = 1 | 2 | 3 | 4 | 5 | 6;

export type HowItWorksInteractiveStep = {
  id: HowItWorksStepId;
  /** i18n key under howItWorks.steps */
  labelKey: string;
  image: string;
  Icon?: LucideIcon;
};

export const serviceProviderSteps: HowItWorksInteractiveStep[] = [
  {
    id: 1,
    labelKey: "generatesQr",
    image: "/how-it-works/sp-1-generate-qr.png",
  },
  {
    id: 2,
    labelKey: "receivesTip",
    image: "/how-it-works/sp-2-tips-balance.png",
  },
  {
    id: 3,
    labelKey: "tracksWithdrawals",
    image: "/how-it-works/sp-3-withdrawal.png",
  },
];

export const tipperSteps: HowItWorksInteractiveStep[] = [
  {
    id: 4,
    labelKey: "scansCode",
    image: "/how-it-works/tp-1-scan-qr.png",
    Icon: QrCode,
  },
  {
    id: 5,
    labelKey: "sendsPayment",
    image: "/how-it-works/tp-2-payment.png",
    Icon: HandCoins,
  },
  {
    id: 6,
    labelKey: "leavesReview",
    image: "/how-it-works/tp-3-review.png",
    Icon: Star,
  },
];

export const howItWorksStepImages: Record<HowItWorksStepId, string> = {
  1: "/how-it-works/sp-1-generate-qr.png",
  2: "/how-it-works/sp-2-tips-balance.png",
  3: "/how-it-works/sp-3-withdrawal.png",
  4: "/how-it-works/tp-1-scan-qr.png",
  5: "/how-it-works/tp-2-payment.png",
  6: "/how-it-works/tp-3-review.png",
};

/** Legacy types kept for any remaining references */
export type HowItWorksFlowStep = {
  title: string;
  description: string;
};

export type HowItWorksRole = "tipper" | "serviceProvider";

export type HowItWorksFlow = {
  heroImage?: string;
  steps: HowItWorksFlowStep[];
};

export const howItWorksFlows: Record<HowItWorksRole, HowItWorksFlow> = {
  tipper: {
    heroImage: "/how-it-works/tipper-flow.png",
    steps: [
      {
        title: "Provider shares QR",
        description:
          "The service provider displays their unique TipTapp QR code for customers.",
      },
      {
        title: "Customer scans",
        description:
          "Scan the QR with your phone and review the provider details.",
      },
      {
        title: "Tip sent & review",
        description:
          "Send your tip securely and leave a quick rating with feedback.",
      },
    ],
  },
  serviceProvider: {
    heroImage: "/how-it-works/sp-flow.png",
    steps: [
      {
        title: "Share Your QR",
        description: "Service provider shares unique QR code with the customer",
      },
      {
        title: "Customer Tips",
        description: "Customer scans and sends tip to the service provider",
      },
      {
        title: "Earn Instantly",
        description: "Tip is received instantly and balance is updated",
      },
    ],
  },
};
