// src/features/admin/categories/components/CategoryImageUpload.tsx

import { useRef, useState, useEffect } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

interface CategoryImageUploadProps {
  value: File | null; // current selected file (or null)
  onChange: (file: File | null) => void;
  previewUrl?: string | null; // existing image URL (for edit mode)
  alt?: string; // fallback alt text for display
}

export function CategoryImageUpload({
  value,
  onChange,
  previewUrl: initialPreview,
  alt = "Category image",
}: CategoryImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Clean up blob URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10 MB.");
      return;
    }

    setIsCompressing(true);

    try {
      // Compress to ~1MB, max 1024px
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);

      // Revoke old preview if it was a blob
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      const newPreview = URL.createObjectURL(compressed);
      setPreview(newPreview);
      onChange(compressed);
    } catch (error) {
      console.error("Image compression failed:", error);
      // Fallback to original file
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
      onChange(file);
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(initialPreview ?? null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <div className="aspect-[4/3]">
            <img
              src={preview}
              alt={alt}
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
            title="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isCompressing}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCompressing ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <ImagePlus size={24} />
          )}
          <span className="mt-3 text-sm font-medium text-slate-700">
            {isCompressing ? "Compressing..." : "Upload category image"}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            JPEG, PNG, WEBP or GIF · Max 1 MB after compression
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 text-sm font-medium text-slate-600 underline underline-offset-2 transition hover:text-slate-900"
        >
          Replace image
        </button>
      )}
    </div>
  );
}
