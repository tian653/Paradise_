import { ArrowRight, ChevronDown } from "lucide-react";
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
    "Persatuan Anak Rantau Dairi (PARADISE) di Kota Semarang didirikan sejak tahun 2013 sebagai wadah mahasiswa asal Kabupaten Dairi untuk mempererat persaudaraan, kebersamaan, dan pengembangan diri bersama.";

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
            <span className={styles.label}>EST. 2013 · DAIRI SEMARANG</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleSub}>KOMUNITAS :</span>
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

        {/* Right Side: Big Paradise Logo */}
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

      {/* Scroll Down Button */}
      <button
        className={styles.scrollDown}
        onClick={scrollToAbout}
        aria-label="Scroll down"
        id="hero-scroll-down"
      >
        <ChevronDown size={22} />
      </button>
    </section>
  );
}
