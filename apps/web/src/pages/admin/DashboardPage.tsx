import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Images,
  Users,
  Phone,
  User,
  TrendingUp,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
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
    {
      label: "Kegiatan",
      value: stats.activities,
      icon: Calendar,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      desc: "Total kegiatan terdaftar",
      link: "/admin/activities",
    },
    {
      label: "Foto Galeri",
      value: stats.gallery,
      icon: Images,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.1)",
      desc: "Foto yang diunggah",
      link: "/admin/gallery",
    },
    {
      label: "Pengurus",
      value: stats.officers,
      icon: Users,
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      desc: "Anggota kepengurusan",
      link: "/admin/officers",
    },
  ];

  const quickActions = [
    { label: "Edit Profil", icon: User, to: "/admin/profile", desc: "Nama, tagline, visi, misi" },
    { label: "Tambah Kegiatan", icon: Calendar, to: "/admin/activities", desc: "Buat kegiatan baru" },
    { label: "Upload Foto", icon: Images, to: "/admin/gallery", desc: "Tambah ke galeri" },
    { label: "Data Pengurus", icon: Users, to: "/admin/officers", desc: "Kelola kepengurusan" },
    { label: "Update Kontak", icon: Phone, to: "/admin/contact", desc: "Instagram, WhatsApp, Email" },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Selamat datang kembali di Admin Panel Paradise 👋</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <NavLink key={stat.label} to={stat.link} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon} style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <TrendingUp size={14} className={styles.statTrend} />
            </div>
            <div className={styles.statValue}>
              {loading ? <span className={styles.skeleton} /> : stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statDesc}>{stat.desc}</div>
          </NavLink>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
          <p className={styles.sectionSub}>Pintasan menu yang sering digunakan</p>
        </div>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <NavLink key={action.to} to={action.to} className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <action.icon size={18} />
              </div>
              <div className={styles.actionInfo}>
                <span className={styles.actionLabel}>{action.label}</span>
                <span className={styles.actionDesc}>{action.desc}</span>
              </div>
              <ArrowRight size={15} className={styles.actionArrow} />
            </NavLink>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <span className={styles.infoDot} />
          <span className={styles.infoTitle}>Panduan Pengelolaan</span>
        </div>
        <ul className={styles.infoList}>
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

