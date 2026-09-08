import styles from "./AboutSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface AboutSectionProps {
  profile: SiteSettings | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const missionItems = profile.mission
    ? profile.mission.split("\n").filter((line) => line.trim())
    : [];

  return (
    <section id="tentang" className={`section ${styles.about}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">Tentang Kami</div>
          <h2 className="section-title">Mengenal Paradise</h2>
          <div className="divider" />
        </div>

        {/* About Grid */}
        <div className={styles.grid}>
          {/* About Text */}
          <div className={styles.aboutText}>
            <h3 className={styles.subTitle}>Siapa Kami?</h3>
            <div className={styles.textBlock}>
              {profile.about.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* History */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>📖</div>
            <h3 className={styles.cardTitle}>Sejarah</h3>
            <div className={styles.cardText}>
              {profile.history.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className={styles.vmGrid}>
          {/* Vision */}
          <div className={styles.vmCard}>
            <div className={styles.vmIcon}>
              <span>👁</span>
            </div>
            <h3 className={styles.vmTitle}>Visi</h3>
            <p className={styles.vmText}>{profile.vision}</p>
          </div>

          {/* Mission */}
          <div className={`${styles.vmCard} ${styles.missionCard}`}>
            <div className={styles.vmIcon}>
              <span>🎯</span>
            </div>
            <h3 className={styles.vmTitle}>Misi</h3>
            <ul className={styles.missionList}>
              {missionItems.map((item, i) => (
                <li key={i} className={styles.missionItem}>
                  <span className={styles.missionNum}>{i + 1}</span>
                  <span>{item.replace(/^\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
