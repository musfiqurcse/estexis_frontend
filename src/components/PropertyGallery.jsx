import { useTranslation } from "../i18n";

export function PropertyGallery({ property }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
      <img className="h-full min-h-[320px] rounded-lg object-cover" src={property.images[0]} alt={t(property.titleKey)} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        {property.images.slice(1).map((image) => (
          <img key={image} className="h-full min-h-36 rounded-lg object-cover" src={image} alt={t(property.titleKey)} />
        ))}
      </div>
    </div>
  );
}
