import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBuyerAuth } from "../context/BuyerAuthContext";
import { useTranslation } from "../i18n";

export function BuyerLoginPage() {
  const { t } = useTranslation();
  const { isAuthenticated, login } = useBuyerAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const returnTo = location.state?.returnTo || "/investor";

  useEffect(() => {
    if (isAuthenticated) navigate(returnTo, { replace: true });
  }, [isAuthenticated, navigate, returnTo]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error === "buyer_required" ? t("login.buyerRequired") : t("login.failed"));
    }
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="mx-auto max-w-md border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <LockKeyhole className="h-7 w-7 text-forest" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">{t("login.title")}</h1>
        <p className="mt-1 text-sm leading-6 text-ink/60">{t("login.subtitle")}</p>

        {error && <p className="mt-4 border-l-4 border-[#a23f2d] bg-[#fff4f1] px-3 py-2 text-sm text-[#7f2d20]">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("login.email")}</span>
            <input
              className="input-field h-11"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("login.password")}</span>
            <input
              className="input-field h-11"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {t("login.submit")}
          </button>
        </form>

        <Link to="/investor" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("login.back")}
        </Link>
      </div>
    </div>
  );
}
