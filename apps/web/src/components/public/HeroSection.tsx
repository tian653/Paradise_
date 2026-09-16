import { useState } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./HeroSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface HeroSectionProps {
  profile: SiteSettings | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  const scrollToAbout = () => {
    document.getElementById("tentang")?.scrollIntoView({ behavior: "smooth" });
  };

  const communityName = profile?.communityName || "Paradise";
  const taglineText = profile?.tagline && profile.tagline !== "/" ? profile.tagline : "";
  const historyText = profile?.history || profile?.shortDescription || "";

  // Only display side photo if admin uploaded/provided heroImageUrl
  const heroImage = profile?.heroImageUrl?.trim();
  const displayImg = heroImage && !imgError ? heroImage : null;

  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${displayImg ? styles.inner : styles.innerNoImage}`}>
        {/* Left Side: History & Intro */}
        <div className={styles.textContent}>
          <div className={styles.labelWrap}>
            <span className={styles.label}>DAIRI SEMARANG · EST. 2013</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>{communityName}</span>
          </h1>

          {taglineText && <p className={styles.tagline}>{taglineText}</p>}

          {historyText && <p className={styles.desc}>{historyText}</p>}

          <div className={styles.actions}>
            <button
              className={styles.btnDetail}
              onClick={scrollToAbout}
              id="hero-btn-about"
            >
              <span>Jelajahi Paradise</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Hero Image (only shown if admin provided heroImageUrl) */}
        {displayImg && (
          <div className={styles.logoCol}>
            <div className={styles.logoFrame}>
              <img
                src={displayImg}
                alt="Foto Samping"
                className={styles.logoImg}
                onError={() => setImgError(true)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
