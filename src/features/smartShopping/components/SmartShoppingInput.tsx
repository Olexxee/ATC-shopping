import { type FormEvent, useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface SmartShoppingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export function SmartShoppingInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  autoFocus = false,
}: SmartShoppingInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || !value.trim()) {
      return;
    }

    onSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:border-gray-300 focus-within:shadow-md">
        <div className="flex items-start gap-3 px-4 pt-4">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
            maxLength={2000}
            placeholder="Tell me what you're looking for..."
            className="min-h-[80px] flex-1 resize-none border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <span className="text-xs text-gray-400">
            Describe your budget, style, purpose, color, or delivery needs.
          </span>

          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Finding...
              </>
            ) : (
              <>
                Find it
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-2 text-right text-xs text-gray-400">
        {value.length}/2000
      </div>
    </form>
  );
}
