import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import { SearchBar } from "../components/SearchBar";
import { categoryCards } from "../lib/listingUtils";

export function HomePage() {
  const { t } = useTranslation();
  const reasons = [
    { icon: ShieldCheck, key: "home.trustVerified" },
    { icon: Globe2, key: "home.trustLanguage" },
    { icon: BadgeCheck, key: "home.trustPricing" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=80"
          alt=""
        />
        <div className="page-shell relative grid min-h-[660px] content-end gap-8 py-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
          <div className="max-w-3xl pb-4">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
              {t("home.eyebrow")}
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">{t("home.title")}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 md:text-lg">{t("home.subtitle")}</p>
          </div>
          <div className="lg:col-span-2">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="section-title">{t("home.categories")}</h2>
          <Link to="/properties" className="btn-secondary">
            {t("common.viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categoryCards.map((category) => (
            <Link key={category.key} to={`/properties?asset_type=${category.key}&page=1&page_size=20`} className="group overflow-hidden rounded-lg border border-ink/10 bg-white">
              <img className="h-32 w-full object-cover transition group-hover:scale-105" src={category.image} alt={category.label} />
              <p className="p-4 text-sm font-semibold">{category.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell grid gap-5 py-16 md:grid-cols-3">
        {reasons.map(({ icon: Icon, key }) => (
          <div key={key} className="rounded-lg border border-ink/10 bg-white p-6">
            <Icon className="mb-4 h-7 w-7 text-forest" aria-hidden="true" />
            <h3 className="text-lg font-semibold">{t(key)}</h3>
            <p className="mt-2 muted">{t("home.trustText")}</p>
          </div>
        ))}
      </section>

      <section className="page-shell">
        <div className="grid gap-8 rounded-lg bg-forest p-8 text-white md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{t("home.ownerTitle")}</h2>
            <p className="mt-3 max-w-2xl text-white/75">{t("home.ownerText")}</p>
          </div>
          <button className="btn-secondary border-white/20 bg-white text-forest hover:text-ink">{t("home.ownerCta")}</button>
        </div>
      </section>
    </>
  );
}
