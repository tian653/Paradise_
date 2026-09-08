import { Calendar } from "lucide-react";
import styles from "./ActivitiesSection.module.css";
import type { Activity } from "../../lib/types";

interface ActivitiesSectionProps {
  activities: Activity[];
}

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
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
                  <div className={styles.imgOverlay} />
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
    </section>
  );
}
