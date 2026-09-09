import { memo } from "react";
import styles from "./OfficersSection.module.css";
import type { Officer } from "../../lib/types";

interface OfficersSectionProps {
  officers: Officer[];
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #334155 0%, #64748b 100%)",
  "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  "linear-gradient(135deg, #881337 0%, #f43f5e 100%)",
  "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
];

function getAvatarBackground(name: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash + index) % AVATAR_GRADIENTS.length];
}

const OfficerCard = memo(({ officer, index }: { officer: Officer; index: number }) => {
  const isCore = /ketua|wakil|sekretaris|bendahara|bph/i.test(officer.position);
  const bgStyle = officer.photoUrl ? undefined : { background: getAvatarBackground(officer.name, index) };

  return (
    <div
      className={`${styles.card} ${isCore ? styles.cardCore : ""}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      <div className={styles.photoWrap}>
        {officer.photoUrl ? (
          <img
            src={officer.photoUrl}
            alt={officer.name}
            className={styles.photo}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.photoPlaceholder} style={bgStyle}>
            <span>{officer.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      <h3 className={styles.name} title={officer.name}>
        {officer.name}
      </h3>
      <span className={`${styles.position} ${isCore ? styles.positionCore : ""}`}>
        {officer.position}
      </span>
    </div>
  );
});

OfficerCard.displayName = "OfficerCard";

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
              <OfficerCard key={officer.id} officer={officer} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


