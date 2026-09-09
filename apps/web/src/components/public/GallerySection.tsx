import { useState, useEffect, useCallback, memo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./GallerySection.module.css";
import type { GalleryItem } from "../../lib/types";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const GalleryCard = memo(({
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (index: number) => void;
}) => (
  <div
    className={styles.item}
    style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    onClick={() => onSelect(index)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onSelect(index)}
    id={`gallery-item-${item.id}`}
  >
    <img
      src={item.imageUrl}
      alt={item.caption ?? "Gallery photo"}
      className={styles.img}
      loading="lazy"
      decoding="async"
    />
    <div className={styles.overlay}>
      <span className={styles.zoomIcon}>🔍</span>
      {item.caption && <p className={styles.caption}>{item.caption}</p>}
    </div>
  </div>
));

GalleryCard.displayName = "GalleryCard";

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.length - 1));
  }, [lightboxIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setLightboxIndex((prev) => (prev! < gallery.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  const currentItem = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <section id="galeri" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Galeri</div>
          <h2 className="section-title">Momen Bersama</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Kumpulan foto yang mengabadikan cerita dan kenangan Paradise
          </p>
        </div>

        {gallery.length === 0 ? (
          <p className="text-center text-muted">Belum ada foto.</p>
        ) : (
          <div className={styles.grid}>
            {gallery.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                onSelect={setLightboxIndex}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {currentItem && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          id="gallery-lightbox"
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxIndex(null)}
            aria-label="Tutup galeri"
            id="gallery-lightbox-close"
          >
            <X size={22} />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Foto sebelumnya"
                id="gallery-lightbox-prev"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Foto selanjutnya"
                id="gallery-lightbox-next"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.imageUrl}
              alt={currentItem.caption ?? "Gallery photo"}
              className={styles.lightboxImg}
            />
            <div className={styles.lightboxMeta}>
              {currentItem.caption && (
                <p className={styles.lightboxCaption}>{currentItem.caption}</p>
              )}
              {gallery.length > 1 && (
                <span className={styles.counter}>
                  {lightboxIndex! + 1} / {gallery.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
