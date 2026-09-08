import { useState } from "react";
import { Calendar, X, ExternalLink } from "lucide-react";
import styles from "./ActivitiesSection.module.css";
import type { Activity } from "../../lib/types";

interface ActivitiesSectionProps {
  activities: Activity[];
}

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  return (
    <section id="kegiatan" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Kegiatan</div>
          <h2 className="section-title">Apa yang Kami Lakukan</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Berbagai kegiatan yang mempererat persaudaraan dan mendorong pertumbuhan bersama
          </p>
        </div>

        {activities.length === 0 ? (
          <p className="text-center text-muted">Belum ada kegiatan.</p>
        ) : (
          <div className={styles.grid}>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.08}s` }}
                onClick={() => setSelectedActivity(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedActivity(activity)}
                id={`activity-card-${activity.id}`}
              >
                {/* Image */}
                <div className={styles.imgWrap}>
                  {activity.imageUrl ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.name}
                      className={styles.img}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.imgPlaceholder}>
                      <span>📸</span>
                    </div>
                  )}
                  <div className={styles.imgOverlay}>
                    <span className={styles.viewBadge}>
                      Lihat Detail <ExternalLink size={12} />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.body}>
                  <div className={styles.date}>
                    <Calendar size={13} />
                    <span>{activity.date}</span>
                  </div>
                  <h3 className={styles.name}>{activity.name}</h3>
                  <p className={styles.desc}>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedActivity(null)}
          role="dialog"
          aria-modal="true"
          id="activity-modal"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedActivity(null)}
              aria-label="Tutup detail kegiatan"
              id="activity-modal-close"
            >
              <X size={20} />
            </button>

            {selectedActivity.imageUrl && (
              <div className={styles.modalImgWrap}>
                <img
                  src={selectedActivity.imageUrl}
                  alt={selectedActivity.name}
                  className={styles.modalImg}
                />
              </div>
            )}

            <div className={styles.modalBody}>
              <div className={styles.modalDate}>
                <Calendar size={15} />
                <span>{selectedActivity.date}</span>
              </div>
              <h2 className={styles.modalTitle}>{selectedActivity.name}</h2>
              <div className={styles.modalDivider} />
              <p className={styles.modalDesc}>{selectedActivity.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
