import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { Officer } from "../../lib/types";
import ImageCropperModal from "../../components/admin/ImageCropperModal";
import styles from "./AdminPages.module.css";

type FormData = {
  name: string;
  position: string;
  photoUrl: string;
  sortOrder: number;
};

const EMPTY_FORM: FormData = { name: "", position: "", photoUrl: "", sortOrder: 0 };

export default function AdminOfficersPage() {
  const [items, setItems] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Officer | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    adminApi.getOfficers().then(setItems).catch(() => toast.error("Gagal memuat pengurus")).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sortOrder: items.length + 1 });
    setEditItem(null);
    setModal("create");
  };

  const openEdit = (item: Officer) => {
    setForm({ name: item.name, position: item.position, photoUrl: item.photoUrl ?? "", sortOrder: item.sortOrder });
    setEditItem(item);
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditItem(null); setForm(EMPTY_FORM); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "sortOrder" ? parseInt(value) || 0 : value }));
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile([file]);
    e.target.value = "";
  };

  const handleCroppedUpload = async (files: File[]) => {
    if (!files[0]) return;
    setCropFile(null);
    setUploading(true);
    try {
      const { url } = await adminApi.uploadFile(files[0]);
      setForm((prev) => ({ ...prev, photoUrl: url }));
      toast.success("Foto berhasil diupload");
    } catch (err: any) { toast.error(err?.message || "Gagal upload foto"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.position) { toast.error("Nama dan jabatan wajib diisi"); return; }
    setSaving(true);
    try {
      const payload = { ...form, photoUrl: form.photoUrl || null };
      if (modal === "create") {
        await adminApi.createOfficer(payload as never);
        toast.success("Pengurus berhasil ditambahkan");
      } else if (editItem) {
        await adminApi.updateOfficer(editItem.id, payload);
        toast.success("Pengurus berhasil diperbarui");
      }
      closeModal();
      load();
    } catch { toast.error("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengurus ini?")) return;
    try {
      await adminApi.deleteOfficer(id);
      toast.success("Pengurus dihapus");
      setItems((prev) => prev.filter((o) => o.id !== id));
    } catch { toast.error("Gagal menghapus"); }
  };

  const moveOrder = async (item: Officer, dir: "up" | "down") => {
    const idx = items.findIndex((o) => o.id === item.id);
    const target = dir === "up" ? items[idx - 1] : items[idx + 1];
    if (!target) return;
    try {
      await Promise.all([
        adminApi.updateOfficer(item.id, { sortOrder: target.sortOrder }),
        adminApi.updateOfficer(target.id, { sortOrder: item.sortOrder }),
      ]);
      load();
    } catch { toast.error("Gagal mengubah urutan"); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kepengurusan</h1>
          <p className={styles.pageSubtitle}>Kelola daftar pengurus Paradise</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="officers-add">
          <Plus size={16} /> Tambah Pengurus
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.empty}><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>Belum ada pengurus. Tambah yang pertama!</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td>
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name} className={styles.tableImg} style={{ borderRadius: "50%" }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 600, color: "#fcfbf8" }}>
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className={styles.tableName}>{item.name}</td>
                  <td><span className="badge badge-gold">{item.position}</span></td>
                  <td>{item.sortOrder}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className="btn btn-ghost btn-sm" onClick={() => moveOrder(item, "up")} disabled={idx === 0} id={`officers-up-${item.id}`}><ChevronUp size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => moveOrder(item, "down")} disabled={idx === items.length - 1} id={`officers-down-${item.id}`}><ChevronDown size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)} id={`officers-edit-${item.id}`}><Pencil size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)} id={`officers-delete-${item.id}`}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modal === "create" ? "Tambah Pengurus" : "Edit Pengurus"}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-gold)", display: "block", margin: "0 auto 0.75rem" }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", fontSize: "2rem" }}>👤</div>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} id="officers-form-upload">
                    {uploading ? <span className="spinner" style={{ width: 12, height: 12 }} /> : <Upload size={12} />} Upload Foto
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSelectFile} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nama *</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} id="officers-form-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Jabatan *</label>
                <input name="position" className="form-input" value={form.position} onChange={handleChange} placeholder="Ketua, Sekretaris, dll." id="officers-form-position" />
              </div>
              <div className="form-group">
                <label className="form-label">URL Foto (opsional)</label>
                <input name="photoUrl" className="form-input" value={form.photoUrl} onChange={handleChange} placeholder="atau upload di atas" id="officers-form-photourl" />
              </div>
              <div className="form-group">
                <label className="form-label">Urutan Tampil</label>
                <input type="number" name="sortOrder" className="form-input" value={form.sortOrder} onChange={handleChange} min={0} id="officers-form-sort" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="officers-modal-save">
                {saving ? <span className="spinner" /> : null} Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {cropFile && (
        <ImageCropperModal
          files={cropFile}
          defaultAspect="1:1"
          title="Potong Foto Pengurus"
          onCropComplete={handleCroppedUpload}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
}
