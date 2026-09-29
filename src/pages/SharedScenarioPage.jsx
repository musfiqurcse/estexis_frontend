import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InvestorResults } from "../components/investor/InvestorResults";
import { useTranslation } from "../i18n";
import { getSharedScenario } from "../lib/investorApi";

export function SharedScenarioPage() {
  const { token } = useParams();
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getSharedScenario(token)
      .then((data) => {
        if (active) setResult(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="pb-12">
      <header className="border-b border-ink/10 bg-white">
        <div className="page-shell py-7">
          <p className="text-xs font-semibold uppercase text-forest">{t("shared.eyebrow")}</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{t("shared.title")}</h1>
          {result && <p className="mt-1 text-sm text-ink/55">v{result.version_number} · {result.currency_code}</p>}
        </div>
      </header>
      <div className="page-shell pt-6">
        {loading && (
          <div className="flex min-h-80 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-forest" aria-label={t("shared.loading")} />
          </div>
        )}
        {error && (
          <div className="flex min-h-80 items-center justify-center text-center">
            <div>
              <AlertCircle className="mx-auto h-7 w-7 text-[#a23f2d]" aria-hidden="true" />
              <p className="mt-3 font-semibold">{t("shared.unavailable")}</p>
            </div>
          </div>
        )}
        {result && <InvestorResults result={result} />}
      </div>
    </div>
  );
}
