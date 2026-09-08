import { Instagram, MessageCircle, Mail, Heart } from "lucide-react";
import styles from "./Footer.module.css";
import type { Contact } from "../../lib/types";

interface FooterProps {
  communityName?: string;
  shortDescription?: string;
  contact?: Contact | null;
  logoUrl?: string | null;
}

export default function Footer({
  communityName = "Paradise",
  shortDescription = "",
  contact,
  logoUrl,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          {/* Brand */}
          <div className={styles.brand}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className={styles.logoImage} />
            ) : (
              <div className={styles.logoIcon}>
                {communityName.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className={styles.name}>{communityName}</h3>
            {shortDescription && (
              <p className={styles.desc}>{shortDescription}</p>
            )}
          </div>

          {/* Social Links */}
          <div className={styles.social}>
            <h4 className={styles.socialTitle}>Temukan Kami</h4>
            <div className={styles.socialLinks}>
              {contact?.instagram && (
                <a
                  href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  id="footer-instagram"
                >
                  <Instagram size={18} />
                  <span>{contact.instagram}</span>
                </a>
              )}
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  id="footer-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={styles.socialLink}
                  id="footer-email"
                >
                  <Mail size={18} />
                  <span>{contact.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} {communityName} Community. Made with{" "}
            <Heart size={12} className={styles.heart} /> by Paradise
          </p>
        </div>
      </div>
    </footer>
  );
}
