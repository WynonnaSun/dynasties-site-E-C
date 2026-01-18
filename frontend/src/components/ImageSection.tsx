import { useEffect, useState } from "react";
import { fetchImageSection } from "../lib/api";

type ImageItem = {
  id: number;
  image_url: string;
  alt_text?: string | null;
  link_url?: string | null;
};

type ImageSectionProps = {
  locale: "en" | "zh";
  sectionKey: string;
};

export default function ImageSection({
  locale,
  sectionKey,
}: ImageSectionProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchImageSection(locale, sectionKey)
      .then((data) => {
        setImages(data.images || []);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load images");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [locale, sectionKey]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!images.length) return null;

  return (
    <div className="image-section">
      {images.map((img) => {
        const imageEl = (
          <img
            src={img.image_url}
            alt={img.alt_text || ""}
            style={{ width: "100%", height: "auto" }}
          />
        );

        return (
          <div key={img.id} className="image-item">
            {img.link_url ? (
              <a href={img.link_url} target="_blank" rel="noreferrer">
                {imageEl}
              </a>
            ) : (
              imageEl
            )}
          </div>
        );
      })}
    </div>
  );
}
