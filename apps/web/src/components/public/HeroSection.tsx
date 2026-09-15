import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import styles from "./HeroSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface HeroSectionProps {
  profile: SiteSettings | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("tentang")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToActivities = () => {
    document.getElementById("kegiatan")?.scrollIntoView({ behavior: "smooth" });
  };

  const heroBgImage =
    profile?.heroImageUrl && profile.heroImageUrl.trim().length > 5
      ? profile.heroImageUrl
      : "/hero-bg.jpg";

  const taglineText =
    profile?.tagline && profile.tagline !== "/" ? profile.tagline : "Dairi Horas Njuah Njuah";

  return (
    <section id="home" className={styles.hero}>
      {/* Background Image & Overlay */}
      <div className={styles.heroBg}>
        <img
          src={heroBgImage}
          alt=""
          className={`${styles.heroBgImg} ${styles.imgVisible}`}
          loading="eager"
          decoding="async"
        />
        <div className={styles.overlay} />
        <div className={styles.glowCenter} />
      </div>

      {/* Decorative Orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Hero Content */}
      <div className={`container ${styles.content} ${loaded ? styles.loaded : ""}`}>
        {/* Top Badge */}
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>EST. 2013 · MAHASISWA DAIRI SEMARANG</span>
        </div>

        {/* Main Title */}
        <h1 className={styles.title}>
          {profile?.communityName || "Paradise"}
        </h1>

        {/* Tagline */}
        <p className={styles.tagline}>
          <span className={styles.taglineDecor} />
          <span>{taglineText}</span>
          <span className={styles.taglineDecor} />
        </p>

        {/* Short Description */}
        <p className={styles.desc}>
          {profile?.shortDescription ||
            "Komunitas mahasiswa yang membangun persaudaraan, kreativitas, dan pengembangan diri bersama."}
        </p>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={scrollToAbout}
            id="hero-btn-about"
          >
            <span>Explore Paradise</span>
            <ArrowRight size={18} />
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={scrollToActivities}
            id="hero-btn-activities"
          >
            <Calendar size={18} />
            <span>Lihat Kegiatan</span>
          </button>
        </div>

        {/* Bottom Feature Badges */}
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <Users size={16} className={styles.featureIcon} />
            <span>Persaudaraan Dairi</span>
          </div>
          <div className={styles.featureDivider} />
          <div className={styles.featureItem}>
            <MapPin size={16} className={styles.featureIcon} />
            <span>Kota Semarang</span>
          </div>
          <div className={styles.featureDivider} />
          <div className={styles.featureItem}>
            <Sparkles size={16} className={styles.featureIcon} />
            <span>Kreativitas & Seni</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
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
