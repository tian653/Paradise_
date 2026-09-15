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

  const DEFAULT_HERO_IMAGE =
    "https://res.cloudinary.com/tmndf3jh/image/upload/v1788935209/paradise_community/kou4tdutrjn39jwwzgpv.jpg";

  // The 3 hero photos from assets
  const HERO_IMAGES = [
    "/hero-bg.jpg",
    "/hero-bg.png",
    "/hero-bg.webp",
  ];

  if (
    profile?.heroImageUrl &&
    profile.heroImageUrl.trim().length > 5 &&
    !HERO_IMAGES.includes(profile.heroImageUrl)
  ) {
    HERO_IMAGES.unshift(profile.heroImageUrl); // custom image first
  }

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [HERO_IMAGES.length]);

  const taglineText =
    profile?.tagline && profile.tagline !== "/" ? profile.tagline : "Dairi Horas Njuah Njuah";

  return (
    <section id="home" className={styles.hero}>
      {/* Background Slider */}
      <div className={styles.heroBg}>
        {HERO_IMAGES.map((url, idx) => (
          <img
            key={url}
            src={url}
            alt=""
            className={`${styles.heroBgImg} ${
              idx === currentImgIndex ? styles.imgVisible : styles.imgHidden
            }`}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
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

