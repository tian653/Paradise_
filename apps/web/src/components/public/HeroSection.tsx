import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Calendar } from "lucide-react";
import styles from "./HeroSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface HeroSectionProps {
  profile: SiteSettings | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("tentang")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToActivities = () => {
    document.getElementById("kegiatan")?.scrollIntoView({ behavior: "smooth" });
  };

  const bgImageUrl =
    profile?.heroImageUrl && profile.heroImageUrl.trim().length > 5
      ? profile.heroImageUrl
      : "/hero-bg.png";
  const taglineText =
    profile?.tagline && profile.tagline !== "/" ? profile.tagline : "Dairi Horas Njuah Njuah";

  return (
    <section id="home" className={styles.hero}>
      {/* Background */}
      <div className={styles.heroBg}>
        <img
          src={bgImageUrl}
          alt=""
          className={styles.heroBgImg}
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith("/hero-bg.png")) {
              e.currentTarget.src = "/hero-bg.png";
            }
          }}
        />
        <div className={styles.overlay} />
      </div>

      {/* Decorative elements */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Content */}
      <div className={`container ${styles.content} ${loaded ? styles.loaded : ""}`}>
        <div className={styles.badge}>
          <Calendar size={13} className={styles.badgeIcon} />
          <span>EST. 2013</span>
        </div>

        <h1 className={styles.title}>
          {profile?.communityName || "Paradise"}
        </h1>

        <p className={styles.tagline}>
          <span className={styles.taglineDecor} />
          <span>{taglineText}</span>
          <span className={styles.taglineDecor} />
        </p>

        <p className={styles.desc}>
          {profile?.shortDescription ||
            "Komunitas mahasiswa yang membangun persaudaraan, kreativitas, dan pengembangan diri bersama."}
        </p>

        <div className={styles.actions}>
          <button
            className="btn btn-primary btn-lg"
            onClick={scrollToAbout}
            id="hero-btn-about"
          >
            <span>Tentang Kami</span>
            <ArrowRight size={18} />
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={scrollToActivities}
            id="hero-btn-activities"
          >
            <span>Lihat Kegiatan</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button className={styles.scrollDown} onClick={scrollToAbout} aria-label="Scroll down">
        <ChevronDown size={22} />
      </button>
    </section>
  );
}

