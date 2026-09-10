import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Video } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../lib/api";
import type { GalleryItem } from "../../lib/types";
import ImageCropperModal from "../../components/admin/ImageCropperModal";
import styles from "./AdminPages.module.css";
import galleryStyles from "./AdminGalleryPage.module.css";

const isVideoItem = (item: GalleryItem) => {
  if (item.type === "video") return true;
  const url = (item.imageUrl || "").toLowerCase();
  return [".mp4", ".webm", ".mov", ".mkv", ".avi", ".ogv", ".3gp", ".m4v"].some((ext) => url.includes(ext)) || url.includes("/video/upload/");
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [caption, setCaption] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [cropQueue, setCropQueue] = useState<File[] | null>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    adminApi.getGallery().then(setItems).catch(() => toast.error("Gagal memuat galeri")).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    const imageFiles = files.filter((f) => f.type.startsWith("image/") || !f.type.startsWith("video/"));
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));

    if (videoFiles.length > 0) {
      const toastId = toast.loading(`Mengupload ${videoFiles.length} video...`);
      let currentMax = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder || 0)) : 0;
      try {
        for (const file of videoFiles) {
          currentMax += 1;
          const { url } = await adminApi.uploadFile(file);
          await adminApi.createGalleryItem({ imageUrl: url, caption: null, sortOrder: currentMax, type: "video" });
        }
        toast.success(`${videoFiles.length} video berhasil diupload!`, { id: toastId });
        load();
      } catch (err: any) {
        toast.error(err?.message || "Gagal mengupload video", { id: toastId });
      }
    }

    if (imageFiles.length > 0) {
      setCropQueue(imageFiles);
    }
  };

  const handleCroppedUpload = async (files: File[]) => {
    setCropQueue(null);
    if (!files.length) return;
    const toastId = toast.loading(`Mengupload ${files.length} foto...`);
    let currentMax = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder || 0)) : 0;
    try {
      for (const file of files) {
        currentMax += 1;
        const { url } = await adminApi.uploadFile(file);
        await adminApi.createGalleryItem({ imageUrl: url, caption: null, sortOrder: currentMax, type: "image" });
      }
      toast.success(`${files.length} foto berhasil diupload!`, { id: toastId });
      load();
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengupload foto", { id: toastId });
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    if (sortOrder < 1) {
      toast.error("Urutan media minimal 1");
      return;
    }
    const isDuplicate = items.some(
      (item) => item.id !== editItem.id && item.sortOrder === sortOrder
    );
    if (isDuplicate) {
      toast.error(`Urutan #${sortOrder} sudah digunakan media lain`);
      return;
    }

    setSaving(true);
    try {
      await adminApi.updateGalleryItem(editItem.id, { caption: caption || null, sortOrder });
      toast.success("Media berhasil diperbarui");
      setEditItem(null);
      load();
    } catch {
      toast.error("Gagal menyimpan media");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus item ini dari galeri?")) return;
    try {
      await adminApi.deleteGalleryItem(id);
      toast.success("Item dihapus");
      setItems((prev) => prev.filter((g) => g.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const moveOrder = async (item: GalleryItem, dir: "left" | "right") => {
    const idx = items.findIndex((g) => g.id === item.id);
    const targetIdx = dir === "left" ? idx - 1 : idx + 1;
    const target = items[targetIdx];
    if (!target) return;

    const newItems = [...items];
    newItems[idx] = target;
    newItems[targetIdx] = item;

    const resequenced = newItems.map((it, i) => ({ ...it, sortOrder: i + 1 }));
    setItems(resequenced);

    try {
      await Promise.all([
        adminApi.updateGalleryItem(item.id, { sortOrder: targetIdx + 1 }),
        adminApi.updateGalleryItem(target.id, { sortOrder: idx + 1 }),
      ]);
      load();
    } catch {
      toast.error("Gagal mengubah urutan media");
      load();
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setCaption(item.caption ?? "");
    setSortOrder(item.sortOrder || 1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Galeri</h1>
          <p className={styles.pageSubtitle}>Kelola koleksi foto dan video Paradise</p>
        </div>
        <button className="btn btn-primary" onClick={() => batchInputRef.current?.click()} id="gallery-upload">
          <Plus size={16} /> Upload Media
        </button>
        <input ref={batchInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleSelectFiles} />
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>Belum ada media. Klik "Upload Media" untuk menambahkan foto atau video!</div>
      ) : (
        <div className={galleryStyles.grid}>
          {items.map((item, idx) => {
            const isVideo = isVideoItem(item);
            return (
              <div key={item.id} className={galleryStyles.item}>
                <span className="badge badge-gold" style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
                  #{item.sortOrder}
                </span>
                {isVideo && (
                  <span className="badge" style={{ position: "absolute", top: 8, right: 8, zIndex: 2, background: "rgba(0,0,0,0.65)", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
                    <Video size={12} /> Video
                  </span>
                )}
                {isVideo ? (
                  <video src={item.imageUrl} className={galleryStyles.img} muted preload="metadata" />
                ) : (
                  <img src={item.imageUrl} alt={item.caption ?? "Gallery"} className={galleryStyles.img} loading="lazy" />
                )}
                <div className={galleryStyles.overlay}>
                  {item.caption && <p className={galleryStyles.caption}>{item.caption}</p>}
                  <div className={galleryStyles.actions}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); moveOrder(item, "left"); }}
                      disabled={idx === 0}
                      id={`gallery-prev-${item.id}`}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); moveOrder(item, "right"); }}
                      disabled={idx === items.length - 1}
                      id={`gallery-next-${item.id}`}
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openEdit(item)}
                      id={`gallery-edit-${item.id}`}
                    >
                      <Pencil size={12} /> Edit
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
            );
          })}
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
              <h3 className={styles.modalTitle}>Edit {isVideoItem(editItem) ? "Video" : "Foto"} Galeri</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {isVideoItem(editItem) ? (
                <video src={editItem.imageUrl} controls style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
              ) : (
                <img src={editItem.imageUrl} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
              )}
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input
                  className="form-input"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tulis caption..."
                  id="gallery-caption-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Urutan Tampil (Minimal 1)</label>
                <input
                  type="number"
                  className="form-input"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  id="gallery-sort-input"
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
