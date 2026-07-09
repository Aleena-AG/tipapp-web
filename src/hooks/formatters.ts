export function formatNumber(
  num: string | number,
  showCurrency: boolean = false,
  conversionRate: number = 1,
  currencySymbol: string = "",
  separator: string = ","
): string {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;
  const convertedNum = parsedNum * conversionRate;
  const formattedNum = convertedNum
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return showCurrency ? `${currencySymbol} ${formattedNum}` : formattedNum;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}`;
}
