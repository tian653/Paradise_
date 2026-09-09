import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { Activity } from "../../lib/types";
import styles from "./AdminPages.module.css";

type FormData = {
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

const EMPTY_FORM: FormData = {
  name: "",
  date: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
};

export default function AdminActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Activity | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    adminApi
      .getActivities()
      .then(setItems)
      .catch(() => toast.error("Gagal memuat kegiatan"))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditItem(null);
    setModal("create");
  };

  const openEdit = (item: Activity) => {
    setForm({
      name: item.name,
      date: item.date,
      description: item.description,
      imageUrl: item.imageUrl ?? "",
      sortOrder: item.sortOrder,
    });
    setEditItem(item);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditItem(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? parseInt(value) || 0 : value,
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadFile(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Foto berhasil diupload");
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.date) {
      toast.error("Nama dan tanggal wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, imageUrl: form.imageUrl || null };
      if (modal === "create") {
        await adminApi.createActivity(payload as never);
        toast.success("Kegiatan berhasil ditambahkan");
      } else if (editItem) {
        await adminApi.updateActivity(editItem.id, payload);
        toast.success("Kegiatan berhasil diperbarui");
      }
      closeModal();
      load();
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    try {
      await adminApi.deleteActivity(id);
      toast.success("Kegiatan dihapus");
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kegiatan</h1>
          <p className={styles.pageSubtitle}>Kelola daftar kegiatan Paradise</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="activities-add">
          <Plus size={16} /> Tambah Kegiatan
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.empty}><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>Belum ada kegiatan. Tambah yang pertama!</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={styles.tableImg} />
                    ) : (
                      <div
                        style={{
                          width: 48, height: 48, background: "var(--color-surface)",
                          borderRadius: "var(--radius-sm)", display: "flex",
                          alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
                        }}
                      >📸</div>
                    )}
                  </td>
                  <td className={styles.tableName}>{item.name}</td>
                  <td>{item.date}</td>
                  <td style={{ maxWidth: 200 }}>
                    <span style={{
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>{item.description}</span>
                  </td>
                  <td>{item.sortOrder}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(item)}
                        id={`activities-edit-${item.id}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                        id={`activities-delete-${item.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modal === "create" ? "Tambah Kegiatan" : "Edit Kegiatan"}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} id="activities-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Nama Kegiatan *</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} id="activities-form-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal / Tahun *</label>
                <input name="date" className="form-input" value={form.date} onChange={handleChange} placeholder="Contoh: Oktober 2025" id="activities-form-date" />
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} rows={4} id="activities-form-description" />
              </div>
              <div className="form-group">
                <label className="form-label">Foto Kegiatan</label>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "0.5rem" }} />
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input name="imageUrl" className="form-input" value={form.imageUrl} onChange={handleChange} placeholder="URL foto atau upload di bawah" id="activities-form-imageurl" />
                  <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} id="activities-form-upload">
                    {uploading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Upload size={14} />}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
              </div>
              <div className="form-group">
                <label className="form-label">Urutan Tampil</label>
                <input type="number" name="sortOrder" className="form-input" value={form.sortOrder} onChange={handleChange} min={0} id="activities-form-sort" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-ghost" onClick={closeModal} id="activities-modal-cancel">Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="activities-modal-save">
                {saving ? <span className="spinner" /> : null}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
