import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { Contact, AdditionalLink } from "../../lib/types";
import styles from "./AdminPages.module.css";

export default function AdminContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getContact().then(setContact).catch(() => toast.error("Gagal memuat kontak")).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const addAdditional = () => {
    setContact((prev) =>
      prev ? { ...prev, additional: [...(prev.additional ?? []), { label: "", url: "" }] } : prev
    );
  };

  const updateAdditional = (i: number, field: keyof AdditionalLink, value: string) => {
    setContact((prev) => {
      if (!prev) return prev;
      const additional = [...prev.additional];
      additional[i] = { ...additional[i], [field]: value };
      return { ...prev, additional };
    });
  };

  const removeAdditional = (i: number) => {
    setContact((prev) => prev ? { ...prev, additional: prev.additional.filter((_, j) => j !== i) } : prev);
  };

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateContact(contact);
      setContact(updated);
      toast.success("Kontak berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan kontak");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loadingWrap}><div className="spinner" /></div>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kontak</h1>
          <p className={styles.pageSubtitle}>Kelola informasi kontak Paradise</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="contact-save">
          {saving ? <span className="spinner" /> : <Save size={16} />} Simpan
        </button>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Media Sosial & Kontak Utama</h3>
        <div className={styles.gridTwo}>
          <div className="form-group">
            <label className="form-label">Instagram</label>
            <input
              name="instagram"
              className="form-input"
              value={contact?.instagram ?? ""}
              onChange={handleChange}
              placeholder="@paradise.community"
              id="contact-instagram"
            />
            <span className="form-hint">Contoh: @paradise.community</span>
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp</label>
            <input
              name="whatsapp"
              className="form-input"
              value={contact?.whatsapp ?? ""}
              onChange={handleChange}
              placeholder="628123456789"
              id="contact-whatsapp"
            />
            <span className="form-hint">Format: 628xxxxxxxxx (tanpa + atau spasi)</span>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-input"
            value={contact?.email ?? ""}
            onChange={handleChange}
            placeholder="paradisecommunity@gmail.com"
            id="contact-email"
          />
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
          <h3 className={styles.cardTitle} style={{ margin: 0, padding: 0, border: 0 }}>Link Tambahan (Opsional)</h3>
          <button className="btn btn-outline btn-sm" onClick={addAdditional} id="contact-add-link">
            <Plus size={14} /> Tambah Link
          </button>
        </div>
        {(contact?.additional ?? []).length === 0 ? (
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>Belum ada link tambahan.</p>
        ) : (
          contact?.additional.map((link, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
              <input
                className="form-input"
                value={link.label}
                onChange={(e) => updateAdditional(i, "label", e.target.value)}
                placeholder="Label (contoh: YouTube)"
                id={`contact-link-label-${i}`}
              />
              <input
                className="form-input"
                value={link.url}
                onChange={(e) => updateAdditional(i, "url", e.target.value)}
                placeholder="https://..."
                id={`contact-link-url-${i}`}
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeAdditional(i)}
                id={`contact-link-remove-${i}`}
                style={{ flexShrink: 0 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
