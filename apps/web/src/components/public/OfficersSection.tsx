import { memo } from "react";
import { ShieldCheck, UserCheck } from "lucide-react";
import styles from "./OfficersSection.module.css";
import type { Officer } from "../../lib/types";

interface OfficersSectionProps {
  officers: Officer[];
}

function getAvatarBackground(name: string): string {
  const gradients = [
    "linear-gradient(135deg, #8B7355 0%, #756044 100%)",
    "linear-gradient(135deg, #2b2b2b 0%, #4a4a4a 100%)",
    "linear-gradient(135deg, #9a8161 0%, #68533a 100%)",
    "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

const OfficerCard = memo(({ officer, index }: { officer: Officer; index: number }) => {
  const isCore = /ketua|wakil|sekretaris|bendahara|bph/i.test(officer.position);
  const bgStyle = officer.photoUrl ? undefined : { background: getAvatarBackground(officer.name) };

  return (
    <div
      className={`${styles.card} ${isCore ? styles.cardCore : ""}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      <div className={`${styles.photoWrap} ${isCore ? styles.photoWrapCore : ""}`}>
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
  const coreOfficers = officers.filter((o) =>
    /ketua|wakil|sekretaris|bendahara|bph/i.test(o.position)
  );
  const divisionOfficers = officers.filter(
    (o) => !/ketua|wakil|sekretaris|bendahara|bph/i.test(o.position)
  );

  return (
    <section id="kepengurusan" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Pengurus</div>
          <h2 className="section-title">Tim Pengurus Paradise</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Struktur dan anggota pengurus Paradise
          </p>
        </div>

        {officers.length === 0 ? (
          <p className="text-center text-muted">Belum ada data anggota pengurus.</p>
        ) : (
          <div className={styles.containerWrap}>
            {/* Core Leadership / BPH */}
            {coreOfficers.length > 0 && (
              <div className={styles.groupBlock}>
                <div className={styles.groupHeader}>
                  <ShieldCheck size={15} className={styles.groupIcon} />
                  <span>Badan Pengurus Harian (BPH)</span>
                </div>
                <div className={styles.grid}>
                  {coreOfficers.map((officer, index) => (
                    <OfficerCard key={officer.id} officer={officer} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Division Heads / Kadiv */}
            {divisionOfficers.length > 0 && (
              <div className={styles.groupBlock}>
                {coreOfficers.length > 0 && (
                  <div className={styles.groupHeader}>
                    <UserCheck size={15} className={styles.groupIcon} />
                    <span>Kepala Divisi</span>
                  </div>
                )}
                <div className={styles.grid}>
                  {divisionOfficers.map((officer, index) => (
                    <OfficerCard
                      key={officer.id}
                      officer={officer}
                      index={coreOfficers.length + index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
