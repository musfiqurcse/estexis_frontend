import { CalendarCheck, Heart, UserRound } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { properties } from "../data/properties";
import { useTranslation } from "../i18n";

export function DashboardPage() {
  const { t, formatDate } = useTranslation();
  const inquiries = [
    { property: properties[0], status: "active", date: "2026-06-14" },
    { property: properties[2], status: "reviewing", date: "2026-02-02" },
    { property: properties[3], status: "closed", date: "2025-12-12" },
  ];

  return (
    <div className="page-shell py-10">
      <h1 className="section-title">{t("dashboard.title")}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <CalendarCheck className="h-5 w-5 text-forest" aria-hidden="true" />
            {t("dashboard.bookings")}
          </h2>
          <div className="space-y-4">
            {inquiries.map(({ property, status, date }) => (
              <div key={`${property.id}-${status}`} className="grid gap-4 rounded-lg border border-ink/10 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
                <img className="h-24 w-full rounded-lg object-cover sm:h-20" src={property.images[0]} alt={t(property.titleKey)} />
                <div>
                  <h3 className="font-semibold">{t(property.titleKey)}</h3>
                  <p className="muted">{formatDate(date)} · {t(property.locationKey)}</p>
                </div>
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest">{t(`dashboard.${status}`)}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-6">
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
              <UserRound className="h-5 w-5 text-forest" aria-hidden="true" />
              {t("dashboard.profile")}
            </h2>
            <p className="muted">{t("home.subtitle")}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Heart className="h-5 w-5 text-forest" aria-hidden="true" />
              {t("dashboard.saved")}
            </h2>
            <PropertyCard property={properties[1]} />
          </div>
        </aside>
      </div>
    </div>
  );
}
