import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImagePlus, Link as LinkIcon, Loader2, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateSourcingRequest } from "../sourcing.mutations";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface ImagePreview {
  id: string;
  file: File;
  url: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function SourcingRequestForm() {
  const navigate = useNavigate();
  const createRequest = useCreateSourcingRequest();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  /*
   * Mirror `images` into a ref so the unmount cleanup can read the
   * *latest* value without re-registering the effect on every change.
   *
   * If the cleanup effect depended on `[images]`, React would run its
   * cleanup before every re-registration — revoking blob URLs that are
   * still being rendered in the preview grid. Adding a second image
   * would blank out the first one's preview.
   *
   * The ref indirection keeps the effect mount-only while still seeing
   * the final image list at unmount time.
   */
  const imagesRef = useRef<ImagePreview[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                         */
  /* ---------------------------------------------------------------- */

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    if (files.length > remainingSlots) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !ACCEPTED_MIME_TYPES.includes(
          file.type as (typeof ACCEPTED_MIME_TYPES)[number],
        ) || file.size > MAX_FILE_SIZE,
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" must be a JPEG, PNG, WEBP, or GIF image under 5 MB.`,
      );
      event.target.value = "";
      return;
    }

    const nextImages = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);

    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.url);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedUrl = referenceUrl.trim();

    if (trimmedTitle.length < 2) {
      setError("Please enter the product name or a short description.");
      return;
    }

    try {
      const result = await createRequest.mutateAsync({
        title: trimmedTitle,
        description: trimmedDescription || null,
        referenceUrl: trimmedUrl || null,
        referenceImages: images.map((image) => image.file),
      });

      if (result.type === "CATALOG_MATCH" && result.match?.product?.slug) {
        navigate(`/products/${result.match.product.slug}`);
        return;
      }

      if (result.request?.id) {
        navigate(`/sourcing/${result.request.id}`);
        return;
      }

      setError(
        "Your request was submitted, but we could not open the request details.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your sourcing request.",
      );
    }
  };

  const isSubmitting = createRequest.isPending;

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Find a product for me
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us what you're looking for. You can add a product link or upload
          images to help us identify it.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* TITLE */}
        <div>
          <label
            htmlFor="sourcing-title"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            What are you looking for?
          </label>

          <input
            id="sourcing-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Nike Air Max 95 black"
            maxLength={200}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
          />

          <div className="mt-1.5 flex justify-end">
            <span className="text-xs text-slate-400">{title.length}/200</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label
            htmlFor="sourcing-description"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            More details
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          </label>

          <textarea
            id="sourcing-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add color, size, model, material, or anything else you know."
            maxLength={5000}
            rows={5}
            disabled={isSubmitting}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
          />

          <div className="mt-1.5 flex justify-end">
            <span className="text-xs text-slate-400">
              {description.length}/5000
            </span>
          </div>
        </div>

        {/* REFERENCE URL */}
        <div>
          <label
            htmlFor="sourcing-url"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800"
          >
            <LinkIcon size={15} />
            Product link
            <span className="font-normal text-slate-400">(optional)</span>
          </label>

          <input
            id="sourcing-url"
            type="url"
            value={referenceUrl}
            onChange={(event) => setReferenceUrl(event.target.value)}
            placeholder="https://example.com/product"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
          />
        </div>

        {/* IMAGES */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-800">
              Product images
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <span className="text-xs text-slate-400">
              {images.length}/{MAX_IMAGES}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={image.url}
                  alt={image.file.name}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  disabled={isSubmitting}
                  aria-label={`Remove ${image.file.name}`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <X size={15} />
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400 hover:bg-slate-100">
                <ImagePlus size={22} className="text-slate-500" />

                <span className="mt-2 text-xs font-medium text-slate-600">
                  Add image
                </span>

                <span className="mt-1 text-[11px] text-slate-400">
                  Max 5 MB
                </span>

                <input
                  type="file"
                  accept={ACCEPTED_MIME_TYPES.join(",")}
                  multiple
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-400">
            JPEG, PNG, WEBP, or GIF. Up to 5 images.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X size={17} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            We'll check our catalog first. If we can't find it, your request
            will be sent for sourcing.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Finding product...
              </>
            ) : (
              <>
                <Upload size={17} />
                Find product
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
