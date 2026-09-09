import styles from "./OfficersSection.module.css";
import type { Officer } from "../../lib/types";

interface OfficersSectionProps {
  officers: Officer[];
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
  "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  "linear-gradient(135deg, #881337 0%, #f43f5e 100%)",
  "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
];

function getAvatarStyle(name: string, index: number) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash + index) % AVATAR_GRADIENTS.length;
  return { background: AVATAR_GRADIENTS[colorIndex] };
}

function isCoreRole(position: string) {
  const pos = position.toLowerCase();
  return (
    pos.includes("ketua") ||
    pos.includes("wakil") ||
    pos.includes("sekretaris") ||
    pos.includes("bendahara") ||
    pos.includes("bph")
  );
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
            {officers.map((officer, index) => {
              const isCore = isCoreRole(officer.position);
              const isKetua =
                officer.position.toLowerCase().includes("ketua") &&
                !officer.position.toLowerCase().includes("wakil");

              return (
                <div
                  key={officer.id}
                  className={`${styles.card} ${isKetua ? styles.cardKetua : isCore ? styles.cardCore : ""}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {isKetua && <div className={styles.ketuaBadgeRibbon}>Top Lead</div>}
                  <div className={styles.photoWrap}>
                    {officer.photoUrl ? (
                      <img
                        src={officer.photoUrl}
                        alt={officer.name}
                        className={styles.photo}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={styles.photoPlaceholder}
                        style={getAvatarStyle(officer.name, index)}
                      >
                        <span>{officer.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div
                      className={`${styles.photoRing} ${isCore ? styles.photoRingCore : ""}`}
                    />
                  </div>
                  <h3 className={styles.name} title={officer.name}>
                    {officer.name}
                  </h3>
                  <span
                    className={`${styles.position} ${isCore ? styles.positionCore : ""}`}
                  >
                    {officer.position}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

