import { useEffect, useState } from "react";
import { getListingImages } from "../lib/listingUtils";

export function PropertyGallery({ property }) {
  const images = getListingImages(property);
  const title = property?.title || "Property listing";
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageKey = images.join("|");
  const activeIndex = Math.min(selectedIndex, Math.max(images.length - 1, 0));
  const selectedImage = images[activeIndex] || images[0];

  useEffect(() => {
    setSelectedIndex(0);
  }, [imageKey]);

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px]">
      <div className="relative overflow-hidden rounded-lg bg-ink/5">
        <img className="aspect-[16/10] h-full min-h-[320px] w-full object-cover" src={selectedImage} alt={title} />
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid max-h-[520px] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 lg:grid-cols-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`aspect-[4/3] overflow-hidden rounded-lg border bg-white transition focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 ${
                activeIndex === index ? "border-forest ring-2 ring-forest/20" : "border-ink/10 hover:border-forest/50"
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show listing image ${index + 1}`}
              aria-current={activeIndex === index}
            >
              <img className="h-full w-full object-cover" src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
