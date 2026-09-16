import { Instagram, MessageCircle, Mail, ExternalLink, MapPin } from "lucide-react";
import styles from "./Footer.module.css";
import type { Contact } from "../../lib/types";

interface FooterProps {
  communityName?: string;
  tagline?: string;
  shortDescription?: string;
  logoUrl?: string | null;
  contact?: Contact | null;
}

export default function Footer({
  communityName = "Paradise",
  tagline = "",
  logoUrl,
  contact,
}: FooterProps) {
  const year = new Date().getFullYear();
  const addressText = contact?.address || "";

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>

          {/* ── Col 1: Brand ── */}
          <div className={styles.brand}>
            <div className={styles.brandHead}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className={styles.logoImage} />
              ) : (
                <div className={styles.logoIcon}>
                  {communityName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className={styles.name}>{communityName}</h3>
                {tagline && <p className={styles.tagline}>{tagline}</p>}
              </div>
            </div>
            {addressText && (
              <p className={styles.desc} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                <span>{addressText}</span>
              </p>
            )}

            {/* Social icons */}
            <div className={styles.socials} style={{ marginTop: "0.5rem" }}>
              {contact?.instagram && (
                <a
                  href={`https://instagram.com/${contact.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={styles.socialIcon}
                  aria-label="Email"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          {/* ── Col 2: Navigation ── */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navigasi</h4>
            <ul className={styles.colLinks}>
              <li><a href="#home" className={styles.colLink}>Beranda</a></li>
              <li><a href="#tentang" className={styles.colLink}>Tentang Kami</a></li>
              <li><a href="#kegiatan" className={styles.colLink}>Kegiatan</a></li>
              <li><a href="#galeri" className={styles.colLink}>Galeri</a></li>
              <li><a href="#kepengurusan" className={styles.colLink}>Pengurus</a></li>
            </ul>
          </div>

          {/* ── Col 3: Contact ── */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Kontak</h4>
            <ul className={styles.contactList}>
              {contact?.instagram && (
                <li className={styles.contactItem}>
                  <Instagram size={15} className={styles.contactIcon} />
                  <a
                    href={`https://instagram.com/${contact.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.colLink}
                  >
                    @{contact.instagram.replace(/^@/, "")}
                  </a>
                </li>
              )}
              {contact?.whatsapp && (
                <li className={styles.contactItem}>
                  <MessageCircle size={15} className={styles.contactIcon} />
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.colLink}
                  >
                    {contact.whatsapp}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className={styles.contactItem}>
                  <Mail size={15} className={styles.contactIcon} />
                  <a href={`mailto:${contact.email}`} className={styles.colLink}>
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.additional?.map((link) => (
                <li key={link.url} className={styles.contactItem}>
                  <ExternalLink size={15} className={styles.contactIcon} />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.colLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottom}>
          <p>© {year} {communityName} Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
