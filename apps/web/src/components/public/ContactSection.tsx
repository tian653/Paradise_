import { Instagram, MessageCircle, Mail, ExternalLink } from "lucide-react";
import styles from "./ContactSection.module.css";
import type { Contact } from "../../lib/types";

interface ContactSectionProps {
  contact: Contact | null;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="kontak" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Kontak</div>
          <h2 className="section-title">Hubungi Kami</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Ingin tahu lebih lanjut? Jangan ragu untuk menghubungi kami
          </p>
        </div>

        <div className={styles.cards}>
          {contact?.instagram && (
            <a
              href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              id="contact-instagram"
            >
              <div className={`${styles.icon} ${styles.iconInstagram}`}>
                <Instagram size={28} />
              </div>
              <div className={styles.info}>
                <span className={styles.platform}>Instagram</span>
                <span className={styles.value}>{contact.instagram}</span>
              </div>
              <ExternalLink size={16} className={styles.arrow} />
            </a>
          )}

          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              id="contact-whatsapp"
            >
              <div className={`${styles.icon} ${styles.iconWhatsapp}`}>
                <MessageCircle size={28} />
              </div>
              <div className={styles.info}>
                <span className={styles.platform}>WhatsApp</span>
                <span className={styles.value}>+{contact.whatsapp}</span>
              </div>
              <ExternalLink size={16} className={styles.arrow} />
            </a>
          )}

          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              className={styles.contactCard}
              id="contact-email"
            >
              <div className={`${styles.icon} ${styles.iconEmail}`}>
                <Mail size={28} />
              </div>
              <div className={styles.info}>
                <span className={styles.platform}>Email</span>
                <span className={styles.value}>{contact.email}</span>
              </div>
              <ExternalLink size={16} className={styles.arrow} />
            </a>
          )}

          {contact?.additional?.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              id={`contact-additional-${i}`}
            >
              <div className={`${styles.icon} ${styles.iconExtra}`}>
                <ExternalLink size={28} />
              </div>
              <div className={styles.info}>
                <span className={styles.platform}>{link.label}</span>
                <span className={styles.value}>{link.url}</span>
              </div>
              <ExternalLink size={16} className={styles.arrow} />
            </a>
          ))}

          {!contact?.instagram && !contact?.whatsapp && !contact?.email && (
            <p className="text-center text-muted">Informasi kontak belum tersedia.</p>
          )}
        </div>
      </div>
    </section>
  );
}
