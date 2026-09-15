import { ArrowRight } from "lucide-react";
import styles from "./HeroSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface HeroSectionProps {
  profile: SiteSettings | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const scrollToAbout = () => {
    document.getElementById("tentang")?.scrollIntoView({ behavior: "smooth" });
  };

  const communityName = profile?.communityName || "Paradise";
  const taglineText =
    profile?.tagline && profile.tagline !== "/" ? profile.tagline : "Dairi Horas Njuah Njuah";
  const historyText =
    profile?.history ||
    profile?.shortDescription ||
    "PARADISE berawal dari semangat mahasiswa asal Kabupaten Dairi di Kota Semarang untuk membangun sebuah wadah kebersamaan dan kekeluargaan. Sejak berdiri, PARADISE terus berkembang sebagai tempat berkumpul, berorganisasi, dan mempererat hubungan antarmahasiswa Dairi sekaligus menjaga hubungan dengan daerah asal.";

  const logoUrl =
    profile?.logoUrl && profile.logoUrl.startsWith("http")
      ? profile.logoUrl
      : "/logo.png";

  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        {/* Left Side: History & Intro */}
        <div className={styles.textContent}>
          <div className={styles.labelWrap}>
            <span className={styles.label}>DAIRI SEMARANG · EST. 2013</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>{communityName}</span>
          </h1>

          <p className={styles.tagline}>{taglineText}</p>

          <p className={styles.desc}>{historyText}</p>

          <div className={styles.actions}>
            <button
              className={styles.btnDetail}
              onClick={scrollToAbout}
              id="hero-btn-about"
            >
              <span>Explore Paradise</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Centered Seamless Logo */}
        <div className={styles.logoCol}>
          <div className={styles.logoFrame}>
            <img
              src={logoUrl}
              alt="Logo Paradise"
              className={styles.logoImg}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
