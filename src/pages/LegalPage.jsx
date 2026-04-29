import { useMemo } from "react";
import { useTranslation } from "../i18n";

const pageKeyByType = {
    terms: "terms",
    privacy: "privacy",
    imprint: "imprint",
    impressum: "impressum",
};

export function LegalPage({ type }) {
    const { t } = useTranslation();

    const page = useMemo(() => {
        const key = pageKeyByType[type] || "terms";
        return t(`legal.${key}`);
    }, [type, t]);

    const sections = Array.isArray(page?.sections) ? page.sections : [];

    return (
        <section className="page-shell py-10 md:py-14">
            <header className="max-w-3xl">
                <h1 className="section-title">{page?.title || t("common.brand")}</h1>
                <p className="mt-4 muted">{page?.intro || ""}</p>
            </header>

            <div className="mt-8 grid gap-6 max-w-4xl">
                {sections.map((section, index) => (
                    <article key={`${type}-${index}`} className="rounded-xl border border-ink/10 bg-white p-5 md:p-6">
                        <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
                        <p className="mt-3 leading-7 text-ink/80">{section.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
