/**
 * Helper to compress and resize images client-side before uploading.
 * Reduces large high-res photos (e.g. 5-15MB) to web-friendly sizes (~200-500KB).
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<File> {
  // SVG files and small images (< 400KB) don't need raster compression
  if (!file.type || file.type === "image/svg+xml" || file.size < 400 * 1024) {
    return file;
  }

  // Only compress images
  const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|bmp|heic|heif)$/i.test(file.name);
  if (!isImage) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      // Downscale if dimensions exceed bounds
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Prefer JPEG for photos/large images to ensure high compression ratio
      const isPng = file.type === "image/png" && file.size < 500 * 1024;
      const outputType = isPng ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob || (blob.size >= file.size && file.size < 1024 * 1024)) {
            // Keep original if compressed version is not smaller and already under 1MB
            resolve(file);
            return;
          }
          const extension = isPng ? ".png" : ".jpg";
          const newName = file.name.replace(/\.[^/.]+$/, "") + extension;
          const compressedFile = new File([blob], newName, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
