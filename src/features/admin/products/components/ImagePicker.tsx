import { useEffect, useState, type DragEvent } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImagePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  max?: number;
  disabled?: boolean;
}

const fileKey = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

function Thumb({
  file,
  isCover,
  disabled,
  onRemove,
}: {
  file: File;
  isCover: boolean;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  // One object URL per file, revoked when the thumb unmounts or the file
  // changes, so previews never leak memory.
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <li className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {url && (
        <img
          src={url}
          alt={file.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {isCover && (
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          Cover
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-600 disabled:opacity-50"
      >
        <X size={14} />
      </button>
    </li>
  );
}

export function ImagePicker({
  files,
  onChange,
  label = "Images",
  max = 8,
  disabled = false,
}: ImagePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;

    const picked = Array.from(incoming);
    const images = picked.filter((f) => f.type.startsWith("image/"));

    // Skip files that are already in the list (same name, size and date).
    const known = new Set(files.map(fileKey));
    const fresh = images.filter((f) => {
      const key = fileKey(f);
      if (known.has(key)) return false;
      known.add(key);
      return true;
    });

    const merged = [...files, ...fresh].slice(0, max);

    if (images.length < picked.length) {
      setNotice("Only image files can be added.");
    } else if (files.length + fresh.length > max) {
      setNotice(`You can add up to ${max} images.`);
    } else {
      setNotice(null);
    }

    onChange(merged);
  };

  const removeAt = (index: number) => {
    setNotice(null);
    onChange(files.filter((_, i) => i !== index));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  const isFull = files.length >= max;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {files.length > 0 && (
          <span className="text-xs text-slate-500">
            {files.length} of {max}
          </span>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {files.map((file, index) => (
            <Thumb
              key={fileKey(file)}
              file={file}
              isCover={index === 0}
              disabled={disabled}
              onRemove={() => removeAt(index)}
            />
          ))}
        </ul>
      )}

      {!isFull && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed px-4 py-5 text-sm transition focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-1 ${
            isDragging
              ? "border-slate-900 bg-slate-100 text-slate-900"
              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
          } ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
          <ImagePlus size={18} className="text-slate-400" />
          <span>
            {files.length === 0
              ? "Drop images here or click to browse"
              : "Add more images"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files);
              // Reset so picking the same file again still fires onChange.
              e.target.value = "";
            }}
          />
        </label>
      )}

      {notice && <p className="mt-2 text-xs text-amber-600">{notice}</p>}
      {files.length > 1 && (
        <p className="mt-2 text-xs text-slate-500">
          The first image is used as the cover.
        </p>
      )}
    </div>
  );
}
