import { useState } from "react";
import { Instagram, MessageCircle, Mail, Copy, Check } from "lucide-react";
import styles from "./ContactSection.module.css";
import type { Contact } from "../../lib/types";

interface ContactItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  copyText: string | null;
  id: string;
}

interface ContactSectionProps {
  contact: Contact | null;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (text: string, key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const items: ContactItem[] = [];
  if (contact?.instagram) {
    items.push({
      key: "ig",
      href: `https://instagram.com/${contact.instagram.replace(/^@/, "")}`,
      icon: <Instagram size={22} />,
      iconClass: styles.iconInstagram,
      label: "Instagram",
      value: `@${contact.instagram.replace(/^@/, "")}`,
      copyText: null,
      id: "contact-instagram",
    });
  }
  if (contact?.whatsapp) {
    items.push({
      key: "wa",
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
      icon: <MessageCircle size={22} />,
      iconClass: styles.iconWhatsapp,
      label: "WhatsApp",
      value: contact.whatsapp,
      copyText: contact.whatsapp,
      id: "contact-whatsapp",
    });
  }
  if (contact?.email) {
    items.push({
      key: "email",
      href: `mailto:${contact.email}`,
      icon: <Mail size={22} />,
      iconClass: styles.iconEmail,
      label: "Email",
      value: contact.email,
      copyText: contact.email,
      id: "contact-email",
    });
  }

  return (
    <section id="kontak" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Kontak</div>
          <h2 className="section-title">Hubungi Kami</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Ingin tahu lebih banyak? Silakan hubungi kami.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted">Informasi kontak belum tersedia.</p>
        ) : (
          <div className={styles.cards}>
            {items.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={styles.card}
                id={item.id}
              >
                <div className={`${styles.iconWrap} ${item.iconClass}`}>
                  {item.icon}
                </div>
                <div className={styles.info}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.value}>{item.value}</span>
                </div>
                {item.copyText && (
                  <button
                    className={styles.copyBtn}
                    onClick={(e) => copy(item.copyText!, item.key, e)}
                    title={`Salin ${item.label}`}
                    aria-label={`Salin ${item.label}`}
                  >
                    {copiedKey === item.key
                      ? <Check size={14} className={styles.checkIcon} />
                      : <Copy size={14} />}
                  </button>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
