import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    } catch {
      toast.error("Username atau password salah");
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
              placeholder="admin"
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
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
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
