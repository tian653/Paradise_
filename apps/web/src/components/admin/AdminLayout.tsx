import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  Images,
  Users,
  Phone,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";
import styles from "./AdminLayout.module.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/profile", label: "Profil", icon: User },
  { to: "/admin/activities", label: "Kegiatan", icon: Calendar },
  { to: "/admin/gallery", label: "Galeri", icon: Images },
  { to: "/admin/officers", label: "Kepengurusan", icon: Users },
  { to: "/admin/contact", label: "Kontak", icon: Phone },
];

export default function AdminLayout() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            {profile?.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" className={styles.logoImage} />
            ) : (
              <div className={styles.logoIcon}>
                {profile?.communityName ? profile.communityName.charAt(0).toUpperCase() : "P"}
              </div>
            )}
            <div>
              <span className={styles.logoName}>{profile?.communityName || "Paradise"}</span>
              <span className={styles.logoBadge}>Admin</span>
            </div>
          </div>
          <button
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
            id="sidebar-close"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
              onClick={() => setSidebarOpen(false)}
              id={`sidebar-nav-${item.label.toLowerCase()}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" className={styles.viewSite} id="sidebar-view-site">
            <Globe size={16} />
            <span>Lihat Website</span>
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout} id="sidebar-logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
          <p className={styles.userInfo}>
            Logged in as <strong>{username}</strong>
          </p>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
            id="topbar-menu"
          >
            <Menu size={20} />
          </button>
          <div className={styles.topbarRight}>
            <span className={styles.topbarUser}>{username}</span>
          </div>
        </header>

        {/* Page content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
