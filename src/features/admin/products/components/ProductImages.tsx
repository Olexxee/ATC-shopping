import { ImagePlus, X } from "lucide-react";

interface ProductImagesProps {
  images: File[];
  onChange: (images: File[]) => void;
}

export function ProductImages({ images, onChange }: ProductImagesProps) {
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    onChange([...images, ...selectedFiles]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Product images
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add new images to the product. Existing images are preserved while
          editing.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-50">
        <ImagePlus size={28} className="text-slate-400" />

        <span className="mt-3 text-sm font-medium text-slate-700">
          Add product images
        </span>

        <span className="mt-1 text-xs text-slate-500">
          JPEG, PNG, WebP or GIF
        </span>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFiles}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((image, index) => (
            <ImagePreview
              key={`${image.name}-${index}`}
              image={image}
              onRemove={() => removeImage(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface ImagePreviewProps {
  image: File;
  onRemove: () => void;
}

function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  const previewUrl = URL.createObjectURL(image);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <img
        src={previewUrl}
        alt={image.name}
        className="h-full w-full object-cover"
        onLoad={() => URL.revokeObjectURL(previewUrl)}
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white"
        aria-label={`Remove ${image.name}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
