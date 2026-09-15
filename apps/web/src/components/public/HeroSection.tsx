import { useEffect, useState, useRef } from "react";
import { ChevronDown, ArrowRight, Calendar } from "lucide-react";
import styles from "./HeroSection.module.css";
import type { SiteSettings } from "../../lib/types";

interface HeroSectionProps {
  profile: SiteSettings | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const [customImgLoaded, setCustomImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
      {/* Background Image */}
      <div className={styles.heroBg}>
        <img
          src={heroBgImage}
          alt=""
          className={`${styles.heroBgImg} ${styles.imgVisible}`}
          loading="eager"
          decoding="async"
        />
        <div className={styles.overlay} />
      </div>

      {/* Decorative elements */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Content */}
      <div className={`container ${styles.content} ${loaded ? styles.loaded : ""}`}>

        <h1 className={styles.title}>
          {profile?.communityName || "Paradise"}
        </h1>

        <p className={styles.tagline}>
          <span>{taglineText}</span>
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
            <span>Explore Paradise</span>
            <ArrowRight size={18} />
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

