import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Check,
  ChevronRight,
  SkipForward,
} from "lucide-react";
import { compressImage } from "../../lib/imageCompressor";
import styles from "./ImageCropperModal.module.css";

export type AspectRatioOption = "1:1" | "4:3" | "16:9" | "free";

export interface ImageCropperModalProps {
  files: File[];
  onCropComplete: (croppedFiles: File[]) => void;
  onCancel: () => void;
  defaultAspect?: AspectRatioOption;
  title?: string;
}

export default function ImageCropperModal({
  files,
  onCropComplete,
  onCancel,
  defaultAspect = "4:3",
  title = "Atur Potongan Foto",
}: ImageCropperModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);
  const [aspect, setAspect] = useState<AspectRatioOption>(defaultAspect);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [isProcessing, setIsProcessing] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const currentFile = files[currentIndex];

  // Load image whenever current index changes
  useEffect(() => {
    if (!currentFile) return;

    const url = URL.createObjectURL(currentFile);
    setImageSrc(url);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgElement(img);
      // Reset transform states for new image
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [currentIndex, currentFile]);

  // Calculate crop box dimensions based on viewport & aspect ratio
  const getCropBoxSize = useCallback(() => {
    const vw = 440; // baseline viewport width inside modal
    const vh = 300; // baseline viewport height inside modal

    if (aspect === "1:1") {
      const size = Math.min(vw, vh) - 40;
      return { width: size, height: size };
    }
    if (aspect === "16:9") {
      const width = vw - 40;
      const height = Math.round((width * 9) / 16);
      return { width, height };
    }
    if (aspect === "4:3") {
      const height = vh - 40;
      const width = Math.round((height * 4) / 3);
      return { width, height };
    }
    // Free aspect ratio defaults to fitting container
    return { width: vw - 60, height: vh - 60 };
  }, [aspect]);

  const cropBox = getCropBoxSize();

  // Mouse / Touch Pan Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture errors
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  // Crop & generate current image file
  const generateCroppedFile = async (): Promise<File> => {
    if (!imgElement) return currentFile;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return currentFile;

    // Determine target canvas resolution (e.g. max 1280 width)
    const targetWidth = Math.min(imgElement.naturalWidth, 1280);
    const targetAspect = cropBox.width / cropBox.height;
    const targetHeight = Math.round(targetWidth / targetAspect);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Viewport dimensions
    const vpWidth = viewportRef.current?.clientWidth || 440;
    const vpHeight = viewportRef.current?.clientHeight || 300;

    // Initial scale to fit image in viewport
    const scaleToFit = Math.min(
      vpWidth / imgElement.naturalWidth,
      vpHeight / imgElement.naturalHeight
    );
    const baseWidth = imgElement.naturalWidth * scaleToFit;
    const baseHeight = imgElement.naturalHeight * scaleToFit;

    // Effective scale including zoom
    const effectiveScale = scaleToFit * zoom;

    // Center of viewport and crop box
    const vpCenterX = vpWidth / 2;
    const vpCenterY = vpHeight / 2;

    // Bounding box of crop window relative to viewport center
    const cropLeft = vpCenterX - cropBox.width / 2;
    const cropTop = vpCenterY - cropBox.height / 2;

    // Image center position in viewport with pan
    const imgCenterX = vpCenterX + pan.x;
    const imgCenterY = vpCenterY + pan.y;

    // We render image on canvas transform:
    ctx.save();

    // Map crop window coordinates to target canvas coordinates
    ctx.scale(targetWidth / cropBox.width, targetHeight / cropBox.height);
    ctx.translate(-cropLeft, -cropTop);

    // Apply rotation and pan around image center
    ctx.translate(imgCenterX, imgCenterY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(effectiveScale, effectiveScale);

    ctx.drawImage(
      imgElement,
      -imgElement.naturalWidth / 2,
      -imgElement.naturalHeight / 2
    );

    ctx.restore();

    return new Promise<File>((resolve) => {
      const outputType =
        currentFile.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            resolve(currentFile);
            return;
          }
          const ext = outputType === "image/png" ? ".png" : ".jpg";
          const baseName = currentFile.name.replace(/\.[^/.]+$/, "");
          const croppedName = `${baseName}_cropped${ext}`;

          const rawFile = new File([blob], croppedName, {
            type: outputType,
            lastModified: Date.now(),
          });

          // Run compressor helper to ensure optimized file size
          const compressed = await compressImage(rawFile);
          resolve(compressed);
        },
        outputType,
        0.9
      );
    });
  };

  const handleNext = async () => {
    setIsProcessing(true);
    try {
      const cropped = await generateCroppedFile();
      const nextProcessed = [...processedFiles, cropped];

      if (currentIndex + 1 < files.length) {
        setProcessedFiles(nextProcessed);
        setCurrentIndex((prev) => prev + 1);
      } else {
        onCropComplete(nextProcessed);
      }
    } catch {
      // Fallback to original file on error
      const nextProcessed = [...processedFiles, currentFile];
      if (currentIndex + 1 < files.length) {
        setProcessedFiles(nextProcessed);
        setCurrentIndex((prev) => prev + 1);
      } else {
        onCropComplete(nextProcessed);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipRemaining = () => {
    const remaining = files.slice(currentIndex);
    onCropComplete([...processedFiles, ...remaining]);
  };

  if (!currentFile || !imageSrc) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Crop size={18} style={{ color: "var(--color-gold, #c5a059)" }} />
            <span>{title}</span>
            {files.length > 1 && (
              <span className={styles.badgeQueue}>
                {currentIndex + 1} / {files.length}
              </span>
            )}
          </div>
          <button
            className={styles.closeBtn}
            onClick={onCancel}
            title="Batal"
            id="cropper-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body & Viewport */}
        <div className={styles.body}>
          <div
            ref={viewportRef}
            className={styles.cropViewport}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            id="cropper-viewport"
          >
            {imgElement && (
              <img
                src={imageSrc}
                alt="Preview to crop"
                className={styles.imagePreview}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  maxHeight: "90%",
                  maxWidth: "90%",
                  objectFit: "contain",
                }}
              />
            )}

            {/* Crop Overlay Box */}
            <div className={styles.cropOverlay}>
              <div
                className={styles.cropBox}
                style={{
                  width: cropBox.width,
                  height: cropBox.height,
                  borderRadius: aspect === "1:1" && title.toLowerCase().includes("pengurus") ? "50%" : "4px",
                }}
              >
                <div className={styles.gridLines}>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className={styles.controlsBar}>
            {/* Zoom Control */}
            <div className={styles.controlGroup}>
              <span className={styles.label}>
                <ZoomIn size={14} /> Zoom
              </span>
              <div className={styles.sliderRow}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className={styles.rangeInput}
                  id="cropper-zoom-slider"
                />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            {/* Rotation Control */}
            <div className={styles.controlGroup}>
              <span className={styles.label}>
                <RotateCw size={14} /> Putar
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  id="cropper-rotate-left"
                >
                  <RotateCcw size={14} /> -90°
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  id="cropper-rotate-right"
                >
                  <RotateCw size={14} /> +90°
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setPan({ x: 0, y: 0 });
                  }}
                  id="cropper-reset"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Aspect Ratio Options */}
            <div className={styles.controlGroup}>
              <span className={styles.label}>Rasio</span>
              <div className={styles.aspectRow}>
                {(["1:1", "4:3", "16:9", "free"] as AspectRatioOption[]).map(
                  (ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      className={`${styles.aspectBtn} ${
                        aspect === ratio ? styles.aspectBtnActive : ""
                      }`}
                      onClick={() => setAspect(ratio)}
                      id={`cropper-aspect-${ratio.replace(":", "-")}`}
                    >
                      {ratio === "1:1"
                        ? "1:1 (Persegi)"
                        : ratio === "4:3"
                        ? "4:3 (Standar)"
                        : ratio === "16:9"
                        ? "16:9 (Banner)"
                        : "Bebas"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <div>
            {files.length > 1 && currentIndex < files.length - 1 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleSkipRemaining}
                disabled={isProcessing}
                id="cropper-skip-all"
              >
                <SkipForward size={14} /> Upload Semua (Tanpa Crop)
              </button>
            )}
          </div>
          <div className={styles.footerRight}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={isProcessing}
              id="cropper-cancel"
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={isProcessing}
              id="cropper-submit"
            >
              {isProcessing ? (
                <span className="spinner" />
              ) : currentIndex + 1 < files.length ? (
                <>
                  Lanjut ke Foto Berikutnya <ChevronRight size={16} />
                </>
              ) : (
                <>
                  <Check size={16} /> Potong & Simpan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
