// src/components/review/ReviewStars.tsx

interface ReviewStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-xl",
};

export function ReviewStars({
  rating,
  size = "md",
  showValue = false,
}: ReviewStarsProps) {
  const normalizedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex leading-none tracking-[0.08em] ${sizeClasses[size]}`}
        aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const fillPercentage = Math.max(
            0,
            Math.min(100, (normalizedRating - index) * 100),
          );

          return (
            <span
              key={index}
              aria-hidden="true"
              className="relative inline-block text-neutral-200"
            >
              ★
              {fillPercentage > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden text-neutral-950"
                  style={{
                    width: `${fillPercentage}%`,
                  }}
                >
                  ★
                </span>
              )}
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-neutral-900">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
