import { NotificationType } from "@/utils/types/types";

export interface TipSentDetails {
  currency: string;
  amount: string;
  recipientName: string;
  paymentMethod: string;
  profileImageUrl?: string;
}

const TIP_SENT_TITLE = "tip sent";

const TIP_SENT_MESSAGE_REGEX =
  /sent a tip of ([A-Z]{3})\s+([\d.]+)\s+to\s+(.+?)\s+via\s+(.+?)\.?$/i;

function formatPaymentMethod(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  if (normalized.includes("balance")) return "Account Balance";
  if (normalized.includes("card")) return "Card";
  return raw.trim();
}

export function isTipSentNotification(notification: NotificationType): boolean {
  return notification.Title?.trim().toLowerCase() === TIP_SENT_TITLE;
}

export function parseTipSentNotification(
  notification: NotificationType
): TipSentDetails | null {
  if (!isTipSentNotification(notification)) return null;

  const message = notification.Message || "";
  const match = message.match(TIP_SENT_MESSAGE_REGEX);

  const recipientFromUser = notification.tipper
    ? `${notification.tipper.FirstName || ""} ${notification.tipper.LastName || ""}`.trim()
    : "";

  if (!match && !recipientFromUser) return null;

  const [, currency, amount, recipientFromMessage, paymentMethod] = match || [];

  return {
    currency: currency || "GBP",
    amount: amount || "",
    recipientName: recipientFromUser || recipientFromMessage?.trim() || "",
    paymentMethod: formatPaymentMethod(paymentMethod || "card payment"),
    profileImageUrl:
      notification.TipperProfilePictureUrl ||
      notification.tipper?.ProfilePictureURL ||
      undefined,
  };
}
