import { Coins } from "lucide-react";
import { useTranslation } from "../i18n";

export function CurrencySwitcher() {
  const { currency, currencyLabels, currencySymbols, setCurrency } = useTranslation();

  return (
    <label className="flex items-center gap-1 rounded-lg border border-ink/10 bg-white px-2 py-2 text-sm font-medium sm:gap-2 sm:px-3">
      <Coins className="hidden h-4 w-4 text-forest sm:block" aria-hidden="true" />
      <select
        className="w-[4.5rem] bg-transparent outline-none sm:w-auto"
        value={currency}
        aria-label="Currency"
        onChange={(event) => setCurrency(event.target.value)}
      >
        {Object.entries(currencyLabels).map(([code, label]) => (
          <option key={code} value={code}>
            {currencySymbols[code]} {label}
          </option>
        ))}
      </select>
    </label>
  );
}
