import { CalendarDays, CreditCard } from "lucide-react";
import { formatMoney, parseDecimal } from "../lib/listingUtils";

export function BookingCard({ property, checkout = false }) {
  const rawPrice = property?.price_amount ?? property?.price;
  const price = parseDecimal(rawPrice);
  const closingCost = price ? price * 0.04 : null;
  const registrationFee = price ? price * 0.015 : null;
  const total = price ? price + closingCost + registrationFee : null;
  const currencyCode = property?.currency_code || "EUR";

  return (
    <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <h2 className="mb-4 text-lg font-semibold">{checkout ? "Purchase summary" : "Listing estimate"}</h2>
      <div className="mb-4 rounded-lg bg-mist p-4">
        <p className="text-2xl font-semibold">{formatMoney(rawPrice, currencyCode, property?.price_period)}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Availability: {property?.available_from || "Confirm with seller"}
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span>Listing price</span><span>{formatMoney(rawPrice, currencyCode, property?.price_period)}</span></div>
        <div className="flex justify-between"><span>Closing estimate</span><span>{closingCost ? formatMoney(closingCost, currencyCode) : "—"}</span></div>
        <div className="flex justify-between"><span>Registration estimate</span><span>{registrationFee ? formatMoney(registrationFee, currencyCode) : "—"}</span></div>
        <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold"><span>Total estimate</span><span>{total ? formatMoney(total, currencyCode) : "—"}</span></div>
      </div>
      {checkout ? (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-ink/10 p-3 text-sm text-ink/70">
          <CreditCard className="h-4 w-4 text-forest" aria-hidden="true" />
          Pre-approval: Verified
        </div>
      ) : (
        <button type="button" className="mt-5 w-full btn-primary opacity-70" disabled>
          Inquiry coming soon
        </button>
      )}
    </aside>
  );
}
