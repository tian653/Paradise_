import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { GalleryItem } from "../../lib/types";
import ImageCropperModal from "../../components/admin/ImageCropperModal";
import styles from "./AdminPages.module.css";
import galleryStyles from "./AdminGalleryPage.module.css";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [caption, setCaption] = useState("");
  const [cropQueue, setCropQueue] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    adminApi.getGallery().then(setItems).catch(() => toast.error("Gagal memuat galeri")).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setCropQueue(files);
    e.target.value = "";
  };

  const handleCroppedUpload = async (files: File[]) => {
    setCropQueue(null);
    if (!files.length) return;
    const toastId = toast.loading(`Mengupload ${files.length} foto...`);
    try {
      for (const file of files) {
        const { url } = await adminApi.uploadFile(file);
        await adminApi.createGalleryItem({ imageUrl: url, caption: null, sortOrder: items.length });
      }
      toast.success(`${files.length} foto berhasil diupload!`, { id: toastId });
      load();
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengupload foto", { id: toastId });
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      await adminApi.updateGalleryItem(editItem.id, { caption: caption || null });
      toast.success("Caption berhasil disimpan");
      setEditItem(null);
      load();
    } catch {
      toast.error("Gagal menyimpan caption");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      await adminApi.deleteGalleryItem(id);
      toast.success("Foto dihapus");
      setItems((prev) => prev.filter((g) => g.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setCaption(item.caption ?? "");
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Galeri</h1>
          <p className={styles.pageSubtitle}>Kelola koleksi foto Paradise</p>
        </div>
        <button className="btn btn-primary" onClick={() => batchInputRef.current?.click()} id="gallery-upload">
          <Plus size={16} /> Upload Foto
        </button>
        <input ref={batchInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleSelectFiles} />
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>Belum ada foto. Klik "Upload Foto" untuk menambahkan!</div>
      ) : (
        <div className={galleryStyles.grid}>
          {items.map((item) => (
            <div key={item.id} className={galleryStyles.item}>
              <img src={item.imageUrl} alt={item.caption ?? "Gallery"} className={galleryStyles.img} loading="lazy" />
              <div className={galleryStyles.overlay}>
                {item.caption && <p className={galleryStyles.caption}>{item.caption}</p>}
                <div className={galleryStyles.actions}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => openEdit(item)}
                    id={`gallery-edit-${item.id}`}
                  >
                    <Pencil size={12} /> Caption
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                    id={`gallery-delete-${item.id}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropQueue && (
        <ImageCropperModal
          files={cropQueue}
          defaultAspect="4:3"
          title="Potong Foto Galeri"
          onCropComplete={handleCroppedUpload}
          onCancel={() => setCropQueue(null)}
        />
      )}

      {/* Edit Caption Modal */}
      {editItem && (
        <div className={styles.modalOverlay} onClick={() => setEditItem(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Caption</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <img src={editItem.imageUrl} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input
                  className="form-input"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tulis caption foto..."
                  id="gallery-caption-input"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-ghost" onClick={() => setEditItem(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={saving} id="gallery-caption-save">
                {saving ? <span className="spinner" /> : null} Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
