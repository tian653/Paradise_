import { useEffect, useState } from "react";
import { Calendar, Images, Users } from "lucide-react";
import { adminApi } from "../../lib/api";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activities: 0,
    gallery: 0,
    officers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getActivities(),
      adminApi.getGallery(),
      adminApi.getOfficers(),
    ])
      .then(([acts, gal, offs]) => {
        setStats({
          activities: acts.length,
          gallery: gal.length,
          officers: offs.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Kegiatan", value: stats.activities, icon: Calendar, color: "var(--color-gold)" },
    { label: "Foto Galeri", value: stats.gallery, icon: Images, color: "#60a5fa" },
    { label: "Pengurus", value: stats.officers, icon: Users, color: "#34d399" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Selamat datang di Admin Panel Paradise</p>
      </div>

      <div className={styles.stats}>
        {statCards.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {loading ? "—" : stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.infoBox}>
        <h3>Panduan Cepat</h3>
        <ul>
          <li>Gunakan menu <strong>Profil</strong> untuk mengubah nama, tagline, visi, misi, dan sejarah komunitas</li>
          <li>Tambah atau edit kegiatan di menu <strong>Kegiatan</strong></li>
          <li>Upload foto ke <strong>Galeri</strong> untuk ditampilkan di website</li>
          <li>Kelola daftar pengurus di menu <strong>Kepengurusan</strong></li>
          <li>Update link Instagram, WhatsApp, dan Email di menu <strong>Kontak</strong></li>
        </ul>
      </div>
    </div>
  );
}
