const PENDING_TIP_KEY = "pendingTipPayment";
const TIP_SUCCESS_KEY = "tipSuccessSummary";

export interface PendingTipData {
  TipperID: string;
  ServiceProviderID: string;
  Amount?: number;
  Currency?: string;
  TipDate: string;
  Review: string;
  Rating: number;
  recipientName?: string;
  recipientProfileUrl?: string;
}

export interface PendingTipPayment {
  tipData: PendingTipData;
  paymentIntentId: string;
}

export interface TipSuccessSummary {
  amount: number;
  currency: string;
  recipientName: string;
  recipientProfileUrl?: string;
  serviceProviderId?: string;
  paymentMethod: "Card" | "Account Balance";
  rating?: number;
}

export function setPendingTipPayment(data: PendingTipPayment): void {
  sessionStorage.setItem(PENDING_TIP_KEY, JSON.stringify(data));
}

export function getPendingTipPayment(): PendingTipPayment | null {
  const raw = sessionStorage.getItem(PENDING_TIP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingTipPayment;
  } catch {
    return null;
  }
}

export function clearPendingTipPayment(): void {
  sessionStorage.removeItem(PENDING_TIP_KEY);
}

export function buildTipSuccessSummary(
  tipData: PendingTipData,
  paymentMethod: "Card" | "Account Balance"
): TipSuccessSummary | null {
  if (tipData.Amount == null || !tipData.Currency) return null;

  return {
    amount: tipData.Amount,
    currency: tipData.Currency,
    recipientName: tipData.recipientName || "",
    recipientProfileUrl: tipData.recipientProfileUrl,
    serviceProviderId: tipData.ServiceProviderID,
    paymentMethod,
    rating: tipData.Rating > 0 ? tipData.Rating : undefined,
  };
}

export function setTipSuccessSummary(data: TipSuccessSummary): void {
  sessionStorage.setItem(TIP_SUCCESS_KEY, JSON.stringify(data));
}

export function getTipSuccessSummary(): TipSuccessSummary | null {
  const raw = sessionStorage.getItem(TIP_SUCCESS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TipSuccessSummary;
  } catch {
    return null;
  }
}

export function clearTipSuccessSummary(): void {
  sessionStorage.removeItem(TIP_SUCCESS_KEY);
}
