import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Images,
  Users,
  Phone,
  User,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "../../lib/api";
import styles from "./DashboardPage.module.css";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function DashboardPage() {
  const now = useClock();
  const [stats, setStats] = useState({ activities: 0, gallery: 0, officers: 0 });
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("paradise_username") || "Admin";

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

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statCards = [
    {
      label: "Kegiatan",
      value: stats.activities,
      icon: Calendar,
      color: "var(--color-gold, #f59e0b)",
      bg: "rgba(245,158,11,0.12)",
      desc: "Program terdaftar",
      link: "/admin/activities",
    },
    {
      label: "Foto Galeri",
      value: stats.gallery,
      icon: Images,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.12)",
      desc: "Foto diunggah",
      link: "/admin/gallery",
    },
    {
      label: "Pengurus",
      value: stats.officers,
      icon: Users,
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
      desc: "Anggota aktif",
      link: "/admin/officers",
    },
  ];

  const quickActions = [
    {
      label: "Profil Komunitas",
      icon: User,
      to: "/admin/profile",
      desc: "Logo, tagline, sejarah, visi & misi",
      color: "var(--color-gold, #f59e0b)",
    },
    {
      label: "Kegiatan",
      icon: Calendar,
      to: "/admin/activities",
      desc: "Tambah atau kelola program kegiatan",
      color: "#60a5fa",
    },
    {
      label: "Galeri Foto",
      icon: Images,
      to: "/admin/gallery",
      desc: "Upload dan atur foto komunitas",
      color: "#f472b6",
    },
    {
      label: "Kepengurusan",
      icon: Users,
      to: "/admin/officers",
      desc: "Kelola daftar pengurus periode ini",
      color: "#34d399",
    },
    {
      label: "Informasi Kontak",
      icon: Phone,
      to: "/admin/contact",
      desc: "Instagram, WhatsApp, Email, Alamat",
      color: "#a78bfa",
    },
  ];

  const tips = [
    "Gunakan menu Profil untuk ubah nama, tagline, visi, misi, dan sejarah",
    "Upload foto di Galeri agar website terlihat lebih hidup dan menarik",
    "Pastikan kontak selalu diperbarui agar pengunjung bisa menghubungi kita",
    "Tambahkan kegiatan terbaru agar website selalu fresh dan relevan",
  ];

  return (
    <div className={styles.page}>

      {/* ── Hero Greeting ─────────────────────────────────────────────── */}
      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.heroGreeting}>
            <Sparkles size={16} className={styles.heroSpark} />
            <span>{getGreeting()}, {username}!</span>
          </div>
          <h1 className={styles.heroTitle}>Admin Panel <span className={styles.heroHighlight}>Paradise</span></h1>
          <p className={styles.heroSub}>Kelola website komunitas dari sini. Semua perubahan langsung tampil di halaman publik.</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroCta}
          >
            <ExternalLink size={14} />
            Lihat Website
          </a>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.clock}>{timeStr}</div>
          <div className={styles.clockDate}>{dateStr}</div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <NavLink key={stat.label} to={stat.link} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon} style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <ArrowUpRight size={15} className={styles.statArrow} />
            </div>
            <div className={styles.statValue} style={{ color: loading ? "transparent" : undefined }}>
              {loading ? <span className={styles.skeleton} /> : stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statDesc}>{stat.desc}</div>
            <div className={styles.statBar}>
              <div
                className={styles.statBarFill}
                style={{ width: loading ? "0%" : `${Math.min((stat.value / 20) * 100, 100)}%`, background: stat.color }}
              />
            </div>
          </NavLink>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kelola Website</h2>
          <p className={styles.sectionSub}>Pilih bagian yang ingin diperbarui</p>
        </div>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <NavLink key={action.to} to={action.to} className={styles.actionCard}>
              <div className={styles.actionIcon} style={{ background: `${action.color}18`, color: action.color }}>
                <action.icon size={20} />
              </div>
              <div className={styles.actionInfo}>
                <span className={styles.actionLabel}>{action.label}</span>
                <span className={styles.actionDesc}>{action.desc}</span>
              </div>
              <ArrowUpRight size={16} className={styles.actionArrow} />
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── Tips ──────────────────────────────────────────────────────── */}
      <div className={styles.tipsBox}>
        <div className={styles.tipsHeader}>
          <span className={styles.tipsBadge}>Tips</span>
          <span className={styles.tipsTitle}>Panduan Pengelolaan</span>
        </div>
        <ul className={styles.tipsList}>
          {tips.map((tip) => (
            <li key={tip} className={styles.tipsItem}>
              <CheckCircle2 size={15} className={styles.tipsIcon} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
