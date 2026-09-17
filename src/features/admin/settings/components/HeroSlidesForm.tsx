import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useUpdateBusinessConfig } from "../businessConfig.mutations";
import type {
  HeroSlide,
  StoreSettings,
} from "../businessConfig.types";

interface HeroSlidesFormProps {
  settings: StoreSettings;
}

const createEmptySlide = (sortOrder: number): HeroSlide => ({
  id: crypto.randomUUID(),
  eyebrow: "",
  title: "",
  description: "",
  image: "",
  mobileImage: "",
  alignment: "left",
  isActive: true,
  sortOrder,
  href: ""
});

export function HeroSlidesForm({ settings }: HeroSlidesFormProps) {
  const updateConfig = useUpdateBusinessConfig();

  const [slides, setSlides] = useState<HeroSlide[]>(
    settings.heroSlides ?? [],
  );

  useEffect(() => {
    setSlides(settings.heroSlides ?? []);
  }, [settings.heroSlides]);

  const updateSlide = (
    index: number,
    updates: Partial<HeroSlide>,
  ) => {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index
          ? { ...slide, ...updates }
          : slide,
      ),
    );
  };

  const addSlide = () => {
    setSlides((current) => [
      ...current,
      createEmptySlide(current.length),
    ]);
  };

  const removeSlide = (index: number) => {
    setSlides((current) =>
      current
        .filter((_, slideIndex) => slideIndex !== index)
        .map((slide, sortOrder) => ({
          ...slide,
          sortOrder,
        })),
    );
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    setSlides((current) => {
      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      return next.map((slide, sortOrder) => ({
        ...slide,
        sortOrder,
      }));
    });
  };

  const handleSave = async () => {
    const normalizedSlides = slides.map((slide, sortOrder) => ({
      ...slide,
      eyebrow: slide.eyebrow?.trim() || "",
      title: slide.title.trim(),
      description: slide.description?.trim() || "",
      image: slide.image.trim(),
      mobileImage: slide.mobileImage?.trim() || "",
      sortOrder,
    }));

    await updateConfig.mutateAsync({
      key: "store_settings",
      value: {
        ...settings,
        heroSlides: normalizedSlides,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-950">
            Hero Slides
          </h3>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Manage the content and images displayed in the
            homepage hero. Images are currently provided as
            URLs.
          </p>
        </div>

        <button
          type="button"
          onClick={addSlide}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-neutral-700">
            No hero slides configured
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Add a slide to start configuring the homepage hero.
          </p>

          <button
            type="button"
            onClick={addSlide}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            <Plus size={16} />
            Add first slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="rounded-xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    Slide {index + 1}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {slide.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      moveSlide(index, "up")
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move slide up"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={index === slides.length - 1}
                    onClick={() =>
                      moveSlide(index, "down")
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move slide down"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                    aria-label="Delete slide"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <Field label="Eyebrow">
                  <input
                    type="text"
                    value={slide.eyebrow ?? ""}
                    onChange={(event) =>
                      updateSlide(index, {
                        eyebrow: event.target.value,
                      })
                    }
                    placeholder="New collection"
                    className={inputClass}
                  />
                </Field>

                <Field label="Title">
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(event) =>
                      updateSlide(index, {
                        title: event.target.value,
                      })
                    }
                    placeholder="Discover something new"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Desktop image URL"
                  className="lg:col-span-2"
                >
                  <input
                    type="url"
                    value={slide.image}
                    onChange={(event) =>
                      updateSlide(index, {
                        image: event.target.value,
                      })
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Mobile image URL"
                  className="lg:col-span-2"
                >
                  <input
                    type="url"
                    value={slide.mobileImage ?? ""}
                    onChange={(event) =>
                      updateSlide(index, {
                        mobileImage: event.target.value,
                      })
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Description"
                  className="lg:col-span-2"
                >
                  <textarea
                    value={slide.description ?? ""}
                    onChange={(event) =>
                      updateSlide(index, {
                        description: event.target.value,
                      })
                    }
                    placeholder="Short supporting text for the hero."
                    rows={4}
                    className={`${inputClass} resize-none py-3`}
                  />
                </Field>

                <Field label="Text alignment">
                  <select
                    value={slide.alignment ?? "left"}
                    onChange={(event) =>
                      updateSlide(index, {
                        alignment:
                          event.target.value as HeroSlide["alignment"],
                      })
                    }
                    className={inputClass}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </Field>

                <div className="flex items-end">
                  <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-200 px-3">
                    <span className="text-sm font-medium text-neutral-800">
                      Active
                    </span>

                    <input
                      type="checkbox"
                      checked={slide.isActive !== false}
                      onChange={(event) =>
                        updateSlide(index, {
                          isActive: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                  </label>
                </div>
              </div>

              {slide.image && (
                <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  <img
                    src={slide.image}
                    alt=""
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateConfig.isPending}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateConfig.isPending ? "Saving..." : "Save hero slides"}
        </button>
      </div>

      {updateConfig.isSuccess && (
        <p className="text-right text-sm font-medium text-green-600">
          Hero slides saved successfully.
        </p>
      )}

      {updateConfig.isError && (
        <p className="text-right text-sm font-medium text-red-600">
          Failed to save hero slides.
        </p>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Field({
  label,
  children,
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100";