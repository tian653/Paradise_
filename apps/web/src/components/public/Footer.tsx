import { Heart } from "lucide-react";
import styles from "./Footer.module.css";

interface FooterProps {
  communityName?: string;
  shortDescription?: string;
  logoUrl?: string | null;
}

export default function Footer({
  communityName = "Paradise",
  shortDescription = "",
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
