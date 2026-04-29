import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BookingCard } from "../components/BookingCard";
import { properties } from "../data/properties";
import { useTranslation } from "../i18n";

export function BookingPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const property = properties.find((item) => item.id === id) || properties[0];

  return (
    <div className="page-shell py-10">
      <h1 className="section-title">{t("booking.title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold">{t("booking.guestInfo")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2"><span className="text-sm font-semibold">{t("booking.firstName")}</span><input className="input-field" /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">{t("booking.lastName")}</span><input className="input-field" /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">{t("booking.email")}</span><input className="input-field" type="email" /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">{t("booking.phone")}</span><input className="input-field" /></label>
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">{t("booking.payment")}</h2>
            <div className="rounded-lg border border-ink/10 bg-mist p-4 text-sm text-ink/70">{t("booking.card")}</div>
          </div>
          <div className="rounded-lg border border-forest/20 bg-sage p-6">
            <CheckCircle2 className="mb-3 h-8 w-8 text-forest" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{t("booking.confirmation")}</h2>
            <p className="mt-2 muted">{t("booking.confirmationText")} INQ-2049.</p>
            <Link to="/dashboard" className="mt-5 btn-primary">{t("booking.viewDashboard")}</Link>
          </div>
        </section>
        <BookingCard property={property} checkout />
      </div>
    </div>
  );
}
