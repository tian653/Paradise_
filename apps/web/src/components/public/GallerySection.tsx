import { useState, useEffect, useCallback, useRef, memo } from "react";
import { createPortal } from "react-dom";
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

  // Touch/swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.length - 1));
  }, [lightboxIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || gallery.length <= 1) return;
    setLightboxIndex((prev) => (prev! < gallery.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, gallery.length]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext, closeLightbox]);

  // Lock body scroll when lightbox is open
  const isLightboxOpen = lightboxIndex !== null;
  useEffect(() => {
    if (!isLightboxOpen) return;

    // Use a simpler approach to prevent scroll jump
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Make horizontal swipe more sensitive and tolerant of vertical drift
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 0.6) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentItem = lightboxIndex !== null ? gallery[lightboxIndex] : null;
  const isCurrentVideo = currentItem ? isVideoItem(currentItem) : false;

  return (
    <section id="galeri" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Gallery</div>
          <h2 className="section-title">Our Moments</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Koleksi foto dan video kenangan Paradise
          </p>
        </div>

        {gallery.length === 0 ? (
          <p className="text-center text-muted">Koleksi galeri masih kosong.</p>
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
      {currentItem &&
        createPortal(
          <div
            className={styles.lightbox}
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto"
            id="gallery-lightbox"
          >
            {/* Close button */}
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close gallery"
              id="gallery-lightbox-close"
            >
              <X size={20} />
            </button>

            {/* Counter top */}
            {gallery.length > 1 && (
              <div className={styles.counterTop}>
                {lightboxIndex! + 1} / {gallery.length}
              </div>
            )}

            {/* Prev button */}
            {gallery.length > 1 && (
              <button
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous"
                id="gallery-lightbox-prev"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Content */}
            <div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              {isCurrentVideo ? (
                <video
                  key={currentItem.imageUrl}
                  src={currentItem.imageUrl}
                  controls
                  autoPlay
                  playsInline
                  className={styles.lightboxMedia}
                />
              ) : (
                <img
                  key={currentItem.imageUrl}
                  src={currentItem.imageUrl}
                  alt={currentItem.caption ?? "Gallery photo"}
                  className={styles.lightboxMedia}
                />
              )}
              {currentItem.caption && (
                <p className={styles.lightboxCaption}>{currentItem.caption}</p>
              )}
            </div>

            {/* Next button */}
            {gallery.length > 1 && (
              <button
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next"
                id="gallery-lightbox-next"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Swipe hint on mobile */}
            {gallery.length > 1 && (
              <div className={styles.swipeHint}>
                Swipe to navigate
              </div>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}
