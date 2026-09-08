import { useState } from "react";
import { X } from "lucide-react";
import styles from "./GallerySection.module.css";
import type { GalleryItem } from "../../lib/types";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

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
              <div
                key={item.id}
                className={styles.item}
                style={{ animationDelay: `${index * 0.06}s` }}
                onClick={() => setLightboxItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightboxItem(item)}
                id={`gallery-item-${item.id}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? "Gallery photo"}
                  className={styles.img}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <span className={styles.zoomIcon}>🔍</span>
                  {item.caption && (
                    <p className={styles.caption}>{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          id="gallery-lightbox"
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxItem(null)}
            aria-label="Close lightbox"
            id="gallery-lightbox-close"
          >
            <X size={22} />
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.caption ?? "Gallery photo"}
              className={styles.lightboxImg}
            />
            {lightboxItem.caption && (
              <p className={styles.lightboxCaption}>{lightboxItem.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
