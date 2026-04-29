import { AlertCircle } from "lucide-react";
import { useTranslation } from "../i18n";

export function ConstructionBanner() {
    const { t } = useTranslation();

    return (
        <div className="bg-gold/20 border-b-2 border-gold px-4 py-3 sm:px-6">
            <div className="page-shell flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-gold flex-shrink-0" />
                <p className="text-sm font-medium text-ink">
                    🚧 {t("common.underConstruction") || "This site is under construction. Features may be limited or change."}
                </p>
            </div>
        </div>
    );
}
