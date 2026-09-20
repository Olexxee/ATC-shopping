import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import { useCreateReview } from "../../features/reviews/review.queries";

interface ReviewFormProps {
  variantId: string;
  orderId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MAX_IMAGES = 3;

export function ReviewForm({
  variantId,
  orderId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const createReviewMutation = useCreateReview();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) return;

    const remainingSlots = MAX_IMAGES - images.length;

    const nextFiles = selectedFiles
      .slice(0, remainingSlots)
      .filter((file) => file.type.startsWith("image/"));

    setImages((current) => [...current, ...nextFiles]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (rating < 1) return;

    await createReviewMutation.mutateAsync({
      variantId,
      orderId,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
      images,
    });

    setRating(0);
    setHoverRating(0);
    setTitle("");
    setComment("");
    setImages([]);

    onSuccess?.();
  };

  const activeRating = hoverRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-950">
          Write a review
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          Share your experience with this product.
        </p>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-neutral-900">
          Rating
        </label>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= activeRating;

            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                aria-label={`${starValue} star${
                  starValue === 1 ? "" : "s"
                }`}
                className="rounded-md p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  strokeWidth={1.8}
                  className={
                    isActive
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-300"
                  }
                />
              </button>
            );
          })}

          {rating > 0 && (
            <span className="ml-2 text-sm text-neutral-500">
              {rating}/5
            </span>
          )}
        </div>

        {rating === 0 && (
          <p className="mt-2 text-xs text-red-500">
            Please select a rating.
          </p>
        )}
      </div>

      {/* Title */}
      <div className="mb-5">
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-medium text-neutral-900"
        >
          Review title
          <span className="ml-1 font-normal text-neutral-400">
            (optional)
          </span>
        </label>

        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="Summarize your experience"
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-500"
        />

        <div className="mt-1 text-right text-xs text-neutral-400">
          {title.length}/100
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-neutral-900"
        >
          Your review
          <span className="ml-1 font-normal text-neutral-400">
            (optional)
          </span>
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="What did you like or dislike about this product?"
          className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-500"
        />

        <div className="mt-1 text-right text-xs text-neutral-400">
          {comment.length}/2000
        </div>
      </div>

      {/* Images */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-900">
            Photos
            <span className="ml-1 font-normal text-neutral-400">
              (optional)
            </span>
          </label>

          <span className="text-xs text-neutral-400">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {previews.map((preview, index) => (
            <div
              key={`${preview}-${index}`}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-neutral-200"
            >
              <img
                src={preview}
                alt={`Review image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-700"
            >
              <ImagePlus size={22} />

              <span className="mt-1 text-xs">
                Add photo
              </span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="mt-2 text-xs text-neutral-400">
          Add up to 3 photos. JPEG, PNG, WebP or GIF.
        </p>
      </div>

      {/* Error */}
      {createReviewMutation.isError && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {createReviewMutation.error instanceof Error
            ? createReviewMutation.error.message
            : "Unable to submit your review. Please try again."}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={createReviewMutation.isPending}
            className="rounded-xl px-5 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            rating === 0 ||
            createReviewMutation.isPending
          }
          className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createReviewMutation.isPending
            ? "Submitting..."
            : "Submit review"}
        </button>
      </div>
    </form>
  );
}
