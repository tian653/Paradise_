import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kegiatan", href: "#kegiatan" },
  { label: "Galeri", href: "#galeri" },
  { label: "Kepengurusan", href: "#kepengurusan" },
  { label: "Kontak", href: "#kontak" },
];

interface NavbarProps {
  communityName?: string;
  logoUrl?: string | null;
}

export default function Navbar({ communityName = "Paradise", logoUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a
          href="#home"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
        >
          {logoUrl && logoUrl.startsWith("http") ? (
            <img
              src={logoUrl}
              alt=""
              className={styles.logoImg}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className={styles.logoIcon}>P</div>
          )}
          <span className={styles.logoText}>{communityName}</span>
        </a>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {NAV_LINKS.map((link) => {
            const section = link.href.replace("#", "");
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${styles.navLink} ${activeSection === section ? styles.active : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="navbar-hamburger"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map((link) => {
              const section = link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${styles.mobileLink} ${activeSection === section ? styles.active : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
