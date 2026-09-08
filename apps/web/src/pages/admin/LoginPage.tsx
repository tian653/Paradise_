import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
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
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>P</div>
          <h1 className={styles.title}>Paradise Admin</h1>
          <p className={styles.subtitle}>Masuk untuk mengelola konten website</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              className="form-input"
              placeholder="Username admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Password admin"
                style={{ paddingRight: "2.75rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--color-text-secondary, #94a3b8)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  padding: "0.25rem",
                }}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: "center", marginTop: "0.5rem" }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? <span className="spinner" /> : "Masuk"}
          </button>
        </form>

        <p className={styles.backLink}>
          <a href="/" className={styles.link}>← Kembali ke Website</a>
        </p>
      </div>
    </div>
  );
}
