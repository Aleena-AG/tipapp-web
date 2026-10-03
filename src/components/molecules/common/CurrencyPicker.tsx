import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCurrencyCatalog } from "@/currency/useLocationCurrency";

interface CurrencyPickerProps {
  value: string;
  onChange: (code: string) => void;
  id?: string;
  label?: string;
}

function currencyLabel(item: { name: string; symbol: string; code: string }) {
  const symbol = item.symbol.trim();
  const code = item.code.trim();
  if (!symbol || symbol.toUpperCase() === code.toUpperCase()) {
    return `${item.name} (${code})`;
  }
  return `${item.name} (${symbol}) ${code}`;
}

const CurrencyPicker = ({
  value,
  onChange,
  id = "currency-select",
  label = "Currency",
}: CurrencyPickerProps) => {
  const catalog = useCurrencyCatalog();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedCode = (value || "").toUpperCase();
  const selected =
    catalog.currencies.find((item) => item.code === selectedCode) ??
    catalog.currencies[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-9">
      <label
        htmlFor={id}
        className="poppins-regular text-sm leading-normal text-foreground"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[42px] w-full items-center justify-between rounded-8 border border-border bg-[#F8FAFC] px-15 text-left text-sm text-[#0B2C4A] outline-none focus:border-ring dark:border-white/10 dark:bg-[#121e36] dark:text-white dark:focus:border-[#3B82F6]"
      >
        <span className="truncate">
          {selected ? currencyLabel(selected) : selectedCode || "Select currency"}
        </span>
        <span aria-hidden className="ml-8 text-[#7A7A7A] dark:text-white/70">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-[74px] z-30 max-h-[240px] overflow-auto rounded-8 border border-border bg-[#F8FAFC] py-4 shadow-lg dark:border-white/10 dark:bg-[#121e36]"
        >
          {catalog.currencies.map((item) => {
            const isSelected = item.code === selectedCode;
            return (
              <li key={item.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(item.code);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-8 px-15 py-8 text-left text-sm text-[#0B2C4A] hover:bg-[#EAF3FA] dark:text-white dark:hover:bg-white/10"
                >
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  {item.symbol.trim().toUpperCase() === item.code ? null : (
                    <span className="shrink-0 text-[#5A6570] dark:text-white/70">
                      {item.symbol}
                    </span>
                  )}
                  <span className="w-[42px] shrink-0 text-right font-medium">
                    {item.code}
                  </span>
                  <span className="flex w-[16px] shrink-0 justify-end">
                    {isSelected ? (
                      <Check className="h-4 w-4 text-[#0B538D]" aria-hidden />
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CurrencyPicker;
