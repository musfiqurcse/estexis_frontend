import { AlertTriangle, CheckCircle2, FileText, UserRound, Verified } from "lucide-react";
import { useTranslation } from "../../i18n";

const metrics = [
  ["total_acquisition_cost", "money"],
  ["gross_rental_yield_pct", "pct"],
  ["net_operating_income_annual", "money"],
  ["net_operating_yield_pct", "pct"],
  ["yield_on_total_acquisition_cost_pct", "pct"],
  ["price_to_rent_ratio", "ratio"],
  ["total_cash_invested", "money"],
  ["debt_service_monthly", "money"],
  ["pre_tax_cash_flow_monthly", "money"],
  ["cash_on_cash_return_pct", "pct"],
  ["dscr", "ratio"],
  ["break_even_occupancy_pct", "pct"],
];

const provenanceStyles = {
  listing_fact: "border-forest/20 bg-sage text-forest",
  user_assumption: "border-ink/10 bg-mist text-ink/70",
  reviewed_preset: "border-gold/30 bg-[#f7ecd9] text-[#76541f]",
};

const provenanceIcons = {
  listing_fact: FileText,
  user_assumption: UserRound,
  reviewed_preset: Verified,
};

function MetricValue({ value, type, currencyCode }) {
  const { formatCurrency, formatNumber } = useTranslation();
  if (value === null || value === undefined) return <span aria-hidden="true">--</span>;
  if (type === "money") {
    return formatCurrency(Number(value), currencyCode, { maximumFractionDigits: 2 });
  }
  if (type === "pct") {
    return `${formatNumber(Number(value), { maximumFractionDigits: 2 })}%`;
  }
  return formatNumber(Number(value), { maximumFractionDigits: 2 });
}

export function InvestorResults({ result }) {
  const { t, formatNumber } = useTranslation();
  if (!result) {
    return (
      <div className="flex min-h-[26rem] items-center justify-center border border-dashed border-ink/20 bg-white p-8 text-center">
        <div className="max-w-sm">
          <CheckCircle2 className="mx-auto h-7 w-7 text-forest" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-ink">{t("investor.results.emptyTitle")}</p>
          <p className="mt-1 text-sm leading-6 text-ink/60">{t("investor.results.emptyText")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="returns-heading">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-ink/10 pb-3">
          <h2 id="returns-heading" className="text-lg font-semibold text-ink">
            {t("investor.results.title")}
          </h2>
          <span className="text-xs font-medium text-ink/45">
            {t("investor.results.formula")} {result.formula_version}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {metrics.map(([key, type]) => {
            const value = result.metrics?.[key];
            const unavailable = value === null || value === undefined;
            return (
              <div key={key} className="min-h-24 border border-ink/10 bg-white p-4">
                <p className="text-xs font-semibold leading-5 text-ink/55">
                  {t(`investor.metrics.${key}`)}
                </p>
                <p className={`mt-2 text-lg font-semibold ${unavailable ? "text-ink/35" : "text-ink"}`}>
                  <MetricValue value={value} type={type} currencyCode={result.currency_code} />
                </p>
                {unavailable && (
                  <p className="mt-1 text-xs text-ink/45">{t("investor.results.unavailable")}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {result.warnings?.length > 0 && (
        <section className="border-l-4 border-gold bg-[#fff9ef] px-4 py-3" aria-live="polite">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-ink">{t("investor.results.review")}</h3>
              <ul className="mt-1 space-y-1 text-sm text-ink/70">
                {result.warnings.map((warning) => (
                  <li key={warning}>{t(`investor.warnings.${warning}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="assumptions-heading">
        <h2 id="assumptions-heading" className="border-b border-ink/10 pb-3 text-lg font-semibold">
          {t("investor.provenance.title")}
        </h2>
        <div className="mt-3 overflow-x-auto border border-ink/10 bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-mist text-xs font-semibold text-ink/55">
              <tr>
                <th className="px-4 py-3">{t("investor.provenance.input")}</th>
                <th className="px-4 py-3">{t("investor.provenance.value")}</th>
                <th className="px-4 py-3">{t("investor.provenance.source")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {result.inputs.map((input) => {
                const Icon = provenanceIcons[input.provenance] || UserRound;
                return (
                  <tr key={input.field_key}>
                    <td className="px-4 py-3 font-medium">{t(`investor.fields.${input.field_key}`)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatNumber(Number(input.value), { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-semibold ${provenanceStyles[input.provenance]}`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {t(`investor.provenance.${input.provenance}`)}
                      </span>
                      {input.source_reference && (
                        <p className="mt-1 max-w-xl break-words text-xs leading-5 text-ink/50">
                          {input.source_reference}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {result.sensitivity_matrix && (
        <section aria-labelledby="sensitivity-heading">
          <h2 id="sensitivity-heading" className="border-b border-ink/10 pb-3 text-lg font-semibold">
            {t("investor.sensitivity.title")}
          </h2>
          <div className="mt-3 overflow-x-auto border border-ink/10 bg-white p-3">
            <table className="w-full min-w-[32rem] table-fixed text-center text-xs">
              <thead>
                <tr>
                  <th className="h-12 px-2 text-left text-ink/50">{t("investor.sensitivity.vacancy")}</th>
                  {result.sensitivity_matrix.rent_changes_pct.map((rent) => (
                    <th key={rent} className="h-12 px-2 font-semibold text-ink/65">
                      {rent > 0 ? "+" : ""}{rent}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.sensitivity_matrix.vacancy_changes_pct.map((vacancy) => (
                  <tr key={vacancy} className="border-t border-ink/10">
                    <th className="h-12 px-2 text-left font-semibold text-ink/65">
                      {vacancy > 0 ? "+" : ""}{vacancy}%
                    </th>
                    {result.sensitivity_matrix.rent_changes_pct.map((rent) => {
                      const cell = result.sensitivity_matrix.cells.find(
                        (item) => item.rent_change_pct === rent && item.vacancy_change_pct === vacancy,
                      );
                      const value = Number(cell?.cash_on_cash_return_pct);
                      return (
                        <td
                          key={`${rent}-${vacancy}`}
                          className={`h-12 px-2 font-semibold ${value < 0 ? "bg-[#fff1ed] text-[#9b3f28]" : "bg-[#edf6ee] text-forest"}`}
                        >
                          {formatNumber(value, { maximumFractionDigits: 2 })}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink/50">{t("investor.sensitivity.axis")}</p>
        </section>
      )}

      <p className="border-t border-ink/10 pt-4 text-xs leading-5 text-ink/50">
        {t("investor.results.disclaimer")}
      </p>
    </div>
  );
}
