import { CalendarDays, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

export function BookingCard({ property, checkout = false }) {
  const { t, formatCurrency, formatDate } = useTranslation();
  const closingCost = property.price * 0.04;
  const registrationFee = property.price * 0.015;
  const total = property.price + closingCost + registrationFee;

  return (
    <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <h2 className="mb-4 text-lg font-semibold">{checkout ? t("booking.summary") : t("details.availability")}</h2>
      <div className="mb-4 rounded-lg bg-mist p-4">
        <p className="text-2xl font-semibold">{formatCurrency(property.price)}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {t("common.dates")}: {formatDate("2026-07-01")}
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span>{t("common.from")}</span><span>{formatCurrency(property.price)}</span></div>
        <div className="flex justify-between"><span>{t("details.serviceFee")}</span><span>{formatCurrency(closingCost)}</span></div>
        <div className="flex justify-between"><span>{t("details.cleaningFee")}</span><span>{formatCurrency(registrationFee)}</span></div>
        <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold"><span>{t("common.total")}</span><span>{formatCurrency(total)}</span></div>
      </div>
      {checkout ? (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-ink/10 p-3 text-sm text-ink/70">
          <CreditCard className="h-4 w-4 text-forest" aria-hidden="true" />
          {t("booking.card")}
        </div>
      ) : (
        <Link to={`/inquiry/${property.id}`} className="mt-5 w-full btn-primary">
          {t("common.reserve")}
        </Link>
      )}
    </aside>
  );
}
