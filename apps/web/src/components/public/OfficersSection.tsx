import styles from "./OfficersSection.module.css";
import type { Officer } from "../../lib/types";

interface OfficersSectionProps {
  officers: Officer[];
}

export default function OfficersSection({ officers }: OfficersSectionProps) {
  return (
    <section id="kepengurusan" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Kepengurusan</div>
          <h2 className="section-title">Tim Paradise</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Mengenal para pengurus Paradise
          </p>
        </div>

        {officers.length === 0 ? (
          <p className="text-center text-muted">Belum ada data pengurus.</p>
        ) : (
          <div className={styles.grid}>
            {officers.map((officer, index) => (
              <div
                key={officer.id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.photoWrap}>
                  {officer.photoUrl ? (
                    <img
                      src={officer.photoUrl}
                      alt={officer.name}
                      className={styles.photo}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <span>{officer.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className={styles.photoRing} />
                </div>
                <h3 className={styles.name}>{officer.name}</h3>
                <span className={styles.position}>{officer.position}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
