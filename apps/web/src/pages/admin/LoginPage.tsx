import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Isi username dan password");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success("Login berhasil!");
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Username atau password salah";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Glow Orbs background */}
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.logoWrap}>
          <div className={styles.badge}>
            <ShieldCheck size={14} />
            <span>PORTAL ADMIN</span>
          </div>

          <div className={styles.logoBadge}>
            <img
              src="/logo.png"
              alt="Paradise Logo"
              className={styles.logoImg}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className={styles.logoFallback}>P</span>
          </div>

          <h1 className={styles.title}>Paradise Admin</h1>
          <p className={styles.subtitle}>Masuk ke dashboard untuk mengelola konten website</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-username">
              Username
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="login-username"
                type="text"
                className={styles.input}
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            id="login-submit"
          >
            {loading ? <span className={styles.spinner} /> : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className={styles.backWrap}>
          <a href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Kembali ke Website Utama</span>
          </a>
        </div>
      </div>
    </div>
  );
}
