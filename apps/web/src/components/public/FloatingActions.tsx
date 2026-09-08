import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import styles from "./FloatingActions.module.css";

interface FloatingActionsProps {
  whatsapp?: string | null;
}

export default function FloatingActions({ whatsapp }: FloatingActionsProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const waNumber = whatsapp ? whatsapp.replace(/\D/g, "") : null;

  return (
    <aside className={styles.floatingContainer} aria-label="Aksi Cepat">
      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.waButton}
          aria-label="Chat WhatsApp"
          title="Chat via WhatsApp"
          id="floating-whatsapp-btn"
        >
          <MessageCircle size={22} className={styles.waIcon} />
          <span className={styles.waTooltip}>Hubungi Kami</span>
        </a>
      )}

      <button
        onClick={scrollToTop}
        className={`${styles.topButton} ${showTop ? styles.visible : ""}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        id="floating-back-to-top"
      >
        <ArrowUp size={20} />
      </button>
    </aside>
  );
}
