import { useEffect, useState, useRef } from "react";
import { Upload, Save, Info } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";
import ImageCropperModal, { AspectRatioOption } from "../../components/admin/ImageCropperModal";
import styles from "./AdminPages.module.css";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cropState, setCropState] = useState<{
    files: File[];
    field: "logoUrl" | "heroImageUrl";
    aspect: AspectRatioOption;
    title: string;
  } | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .getProfile()
      .then(setProfile)
      .catch(() => toast.error("Gagal memuat profil"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateProfile(profile);
      setProfile(updated);
      toast.success("Profil berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "heroImageUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropState({
      files: [file],
      field,
      aspect: field === "heroImageUrl" ? "4:3" : "1:1",
      title: field === "heroImageUrl" ? "Potong Foto Samping" : "Potong Logo Komunitas",
    });
    e.target.value = "";
  };

  const handleCroppedUpload = async (files: File[]) => {
    if (!cropState || !files[0]) return;
    const { field } = cropState;
    setCropState(null);

    const toastId = toast.loading("Mengupload foto...");
    try {
      const { url } = await adminApi.uploadFile(files[0]);
      const updated = await adminApi.updateProfile({ [field]: url });
      setProfile(updated);
      toast.success("Foto berhasil diupload!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengupload foto", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className="spinner" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kelola Profil</h1>
          <p className={styles.pageSubtitle}>
            Ubah informasi utama komunitas Paradise
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          id="profile-save"
        >
          {saving ? <span className="spinner" /> : <Save size={16} />}
          Simpan
        </button>
      </div>

      {/* Logo Upload */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Logo Komunitas</h3>
        <div className={styles.uploadWrap}>
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt="Logo" className={styles.logoPreview} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <Upload size={24} />
              <span>Belum ada logo</span>
            </div>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => logoInputRef.current?.click()}
            id="profile-upload-logo"
          >
            <Upload size={14} />
            Upload Logo
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleSelectFile(e, "logoUrl")}
          />
        </div>
      </div>

      {/* Hero Image Upload */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Foto Hero (Samping)</h3>
        <div className={styles.uploadWrap}>
          {profile.heroImageUrl ? (
            <img src={profile.heroImageUrl} alt="Hero" className={styles.logoPreview} style={{ borderRadius: "12px", objectFit: "cover" }} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <Upload size={24} />
              <span>Belum ada foto hero</span>
            </div>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => heroInputRef.current?.click()}
            id="profile-upload-hero"
          >
            <Upload size={14} />
            Upload Foto Samping
          </button>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleSelectFile(e, "heroImageUrl")}
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Informasi Dasar</h3>
        <div className={styles.gridTwo}>
          <div className="form-group">
            <label className="form-label">Nama Komunitas</label>
            <input
              name="communityName"
              className="form-input"
              value={profile.communityName || ""}
              onChange={handleChange}
              id="profile-community-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input
              name="tagline"
              className="form-input"
              value={profile.tagline || ""}
              onChange={handleChange}
              placeholder="Tagline singkat komunitas"
              id="profile-tagline"
            />
          </div>
        </div>
      </div>

      {/* History */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Sejarah</h3>
        <div className="form-group">
          <label className="form-label">Sejarah Komunitas</label>
          <textarea
            name="history"
            className="form-textarea"
            value={profile.history || ""}
            onChange={handleChange}
            placeholder="Tulis sejarah berdirinya komunitas Paradise..."
            rows={6}
            id="profile-history"
          />
          <span className="form-hint">
            <Info size={12} style={{ display: "inline", marginRight: 4 }} />
            Ditampilkan sebagai teks utama di hero section
          </span>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Visi &amp; Misi</h3>
        <div className="form-group">
          <label className="form-label">Visi</label>
          <textarea
            name="vision"
            className="form-textarea"
            value={profile.vision || ""}
            onChange={handleChange}
            placeholder="Visi komunitas..."
            rows={3}
            id="profile-vision"
          />
          <span className="form-hint">
            <Info size={12} style={{ display: "inline", marginRight: 4 }} />
            Ditampilkan di section About Us
          </span>
        </div>
        <div className="form-group">
          <label className="form-label">Misi</label>
          <textarea
            name="mission"
            className="form-textarea"
            value={profile.mission || ""}
            onChange={handleChange}
            placeholder={"Tulis tiap poin misi di baris baru. Contoh:\n1. Poin misi pertama\n2. Poin misi kedua"}
            rows={8}
            id="profile-mission"
          />
          <span className="form-hint">
            <Info size={12} style={{ display: "inline", marginRight: 4 }} />
            Tulis tiap poin di baris baru. Format: "1. Poin misi" — ditampilkan di section About Us
          </span>
        </div>
      </div>

      {cropState && (
        <ImageCropperModal
          files={cropState.files}
          defaultAspect={cropState.aspect}
          title={cropState.title}
          onCropComplete={handleCroppedUpload}
          onCancel={() => setCropState(null)}
        />
      )}
    </div>
  );
}
