import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";
import { SecondaryTypo } from "@/components/atoms/typo/secondaryTypo";
import { formatNumber } from "@/hooks/formatters";
import { getDateValueFormated } from "@/hooks/hooks";
import { WithdrawalInvoice } from "@/utils/types/types";
import { useTranslation } from "react-i18next";

interface Props {
  invoice: WithdrawalInvoice;
  balance: number;
  message: string;
}

function getCurrencySymbol(currency?: string): string {
  const normalized = currency?.toUpperCase() || "GBP";
  switch (normalized) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "£";
  }
}

function formatPaymentMethod(method?: string): string {
  if (!method) return "—";
  if (method === "paymentMethodisCard") return "Card";
  return method;
}

function formatStatus(status?: string): string {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function resolvePlatformFee(invoice: WithdrawalInvoice): number {
  const fromApi = resolveInvoiceFee(invoice, "PlatformFee", "platformFee");
  if (fromApi > 0) return fromApi;

  if (invoice.TotalAmount > 0) {
    return Math.round(invoice.TotalAmount * 0.1 * 100) / 100;
  }

  return 0;
}

function resolveInvoiceFee(
  invoice: WithdrawalInvoice,
  directKey: "PlatformFee" | "StripeFee",
  nestedKey: "platformFee" | "stripeFee"
): number {
  const direct = invoice[directKey];
  const parsed =
    typeof direct === "number" ? direct : parseFloat(String(direct ?? ""));
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  const nested = invoice.amounts?.[nestedKey];
  if (nested?.amount != null && nested.amount > 0) return nested.amount;

  const currency = (invoice.Currency || "GBP").toUpperCase();
  const fromAmounts = nested?.amounts?.[currency];
  if (fromAmounts != null && fromAmounts > 0) return fromAmounts;

  return 0;
}

const DetailRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between gap-16 py-10 border-b border-[#F0F0F0] last:border-b-0">
    <SecondaryTypo typo={label} styles="text-sm text-app-muted" />
    <PrimaryTypo
      typo={value}
      styles={`text-sm text-right ${highlight ? "!text-[#9E2A2B]" : ""}`}
    />
  </div>
);

const WithdrawInvoiceSuccessCard = ({
  invoice,
  balance,
  message,
}: Props) => {
  const { t } = useTranslation();
  const currencySymbol = getCurrencySymbol(invoice.Currency || "GBP");
  const remainingBalance =
    typeof balance === "number" && Number.isFinite(balance) ? balance : 0;
  const platformFee = resolvePlatformFee(invoice);
  const stripeFee = resolveInvoiceFee(invoice, "StripeFee", "stripeFee");

  return (
    <div className="w-full max-w-[420px] mx-auto mt-8 px-20">
      <div className="rounded-2xl border border-[#d71921] bg-card shadow-[0_0_15px_0_rgba(215,25,33,0.5)] px-24 py-24">
        <PrimaryTypo
          typo={message || t("payments.invoiceCreated")}
          styles="text-center !text-[18px] text-[#9E2A2B] mb-4"
        />
        <SecondaryTypo
          typo={t("payments.withdrawalInvoiceDetails")}
          styles="text-center text-sm text-app-muted mb-16"
        />

        <DetailRow
          label={t("payments.invoiceId")}
          value={`#${invoice.InvoiceID}`}
          highlight
        />
        <DetailRow
          label={t("payments.date")}
          value={getDateValueFormated(invoice.createdAt)}
        />
        <DetailRow
          label={t("payments.withdrawalAmount")}
          value={formatNumber(
            invoice.TotalAmount,
            true,
            1,
            currencySymbol
          )}
          highlight
        />
        {platformFee > 0 ? (
          <DetailRow
            label={t("payments.platformFee")}
            value={formatNumber(platformFee, true, 1, currencySymbol)}
          />
        ) : null}
        {stripeFee > 0 ? (
          <DetailRow
            label={t("payments.stripeFee")}
            value={formatNumber(stripeFee, true, 1, currencySymbol)}
          />
        ) : null}
        <DetailRow
          label={t("payments.remainingBalance")}
          value={formatNumber(remainingBalance, true, 1, currencySymbol)}
        />
        <DetailRow
          label={t("payments.status")}
          value={formatStatus(invoice.Status)}
        />
        <DetailRow
          label={t("payments.paymentMethod")}
          value={formatPaymentMethod(invoice.PaymentMethod)}
        />
        {invoice.Commission ? (
          <DetailRow
            label={t("payments.commission")}
            value={formatNumber(invoice.Commission, true, 1, currencySymbol)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default WithdrawInvoiceSuccessCard;
