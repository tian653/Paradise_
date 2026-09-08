import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
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

  return (
    <section id="home" className={styles.hero}>
      {/* Background */}
      <div className={styles.heroBg}>
        {profile?.heroImageUrl && (
          <img
            src={profile.heroImageUrl}
            alt="Paradise Community"
            className={styles.heroBgImg}
          />
        )}
        <div className={styles.overlay} />
      </div>

      {/* Decorative elements */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Content */}
      <div className={`container ${styles.content} ${loaded ? styles.loaded : ""}`}>
        <div className={styles.badge}>
          <span>✦</span>
          <span>Est.2013</span>
        </div>

        <h1 className={styles.title}>
          {profile?.communityName || "Paradise"}
        </h1>

        <p className={styles.tagline}>
          {profile?.tagline || "/"}
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
            Tentang Kami
            <ArrowRight size={18} />
          </button>

          <button
            className={styles.secondaryLink}
            onClick={scrollToActivities}
            id="hero-btn-activities"
          >
            <span>Lihat Kegiatan</span>
            <ChevronDown size={16} />
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
