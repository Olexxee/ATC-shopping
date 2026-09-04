import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";

interface VariantImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function VariantImageUpload({
  files,
  onChange,
  maxFiles = 5,
}: VariantImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    setIsCompressing(true);

    const options = {
      maxSizeMB: 1,              // max file size in MB
      maxWidthOrHeight: 1024,    // max width/height in pixels
      useWebWorker: true,
    };

    try {
      const compressedFiles = await Promise.all(
        selected.map((file) => imageCompression(file, options))
      );

      const nextFiles = [...files, ...compressedFiles].slice(0, maxFiles);
      onChange(nextFiles);
    } catch (error) {
      console.error("Image compression failed:", error);
      // Optionally fallback to original files
      const nextFiles = [...files, ...selected].slice(0, maxFiles);
      onChange(nextFiles);
    } finally {
      setIsCompressing(false);
      event.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-900">Product images</h3>
        <p className="mt-1 text-xs text-gray-500">
          Upload up to {maxFiles} images. Maximum 5MB per image (compressed to ~1MB).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {previews.map((preview, index) => (
          <div
            key={preview}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
          >
            <img
              src={preview}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              Remove
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                Primary
              </span>
            )}
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isCompressing}
            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500 transition hover:border-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            {isCompressing ? "Compressing..." : "+ Add image"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        hidden
        onChange={handleFiles}
      />
    </div>
  );
}