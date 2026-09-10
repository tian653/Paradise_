import { useState, useEffect, useCallback, memo } from "react";
import { X, ChevronLeft, ChevronRight, Video, Play } from "lucide-react";
import styles from "./GallerySection.module.css";
import type { GalleryItem } from "../../lib/types";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const isVideoItem = (item: GalleryItem) => {
  if (item.type === "video") return true;
  const url = (item.imageUrl || "").toLowerCase();
  return [".mp4", ".webm", ".mov", ".mkv", ".avi", ".ogv", ".3gp", ".m4v"].some((ext) => url.includes(ext)) || url.includes("/video/upload/");
};

const GalleryCard = memo(({
  item,
  index,
  onSelect,
}: {
  item: GalleryItem;
  index: number;
  onSelect: (index: number) => void;
}) => {
  const isVideo = isVideoItem(item);
  return (
    <div
      className={styles.item}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(index)}
      id={`gallery-item-${item.id}`}
    >
      {isVideo && (
        <span className={styles.videoBadge}>
          <Video size={12} /> Video
        </span>
      )}
      {isVideo ? (
        <video
          src={item.imageUrl}
          className={styles.img}
          muted
          preload="metadata"
        />
      ) : (
        <img
          src={item.imageUrl}
          alt={item.caption ?? "Gallery item"}
          className={styles.img}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className={styles.overlay}>
        <span className={styles.zoomIcon}>
          {isVideo ? <Play size={28} fill="currentColor" /> : "🔍"}
        </span>
        {item.caption && <p className={styles.caption}>{item.caption}</p>}
      </div>
    </div>
  );
});

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
            Kumpulan foto dan video yang mengabadikan cerita dan kenangan Paradise
          </p>
        </div>

        {gallery.length === 0 ? (
          <p className="text-center text-muted">Belum ada koleksi galeri.</p>
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
                aria-label="Item sebelumnya"
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
                aria-label="Item selanjutnya"
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
            {isVideoItem(currentItem) ? (
              <video
                src={currentItem.imageUrl}
                controls
                autoPlay
                className={styles.lightboxImg}
                style={{ maxHeight: "75vh", width: "auto" }}
              />
            ) : (
              <img
                src={currentItem.imageUrl}
                alt={currentItem.caption ?? "Gallery photo"}
                className={styles.lightboxImg}
              />
            )}
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
