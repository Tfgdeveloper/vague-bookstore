import { useEffect, useId, useState } from "react";
import { ChevronDown, ImagePlus, X } from "lucide-react";

/* ==================================================================
   Form fields shared by the Contact section and the Submit page.
   Styled to match the contact design: white, rounded, soft border.
   ================================================================== */

const cx = (...c) => c.filter(Boolean).join(" ");

const inputBase =
  "w-full rounded-md border bg-white px-4 text-[14px] text-[#14213D] placeholder:text-[#8a7d76] outline-none transition-[border-color,box-shadow] focus:border-[#14213D] focus:ring-4 focus:ring-[#14213D]/5 disabled:opacity-60";
const borderFor = (error) => (error ? "border-red-600" : "border-[#E4DDD3] hover:border-[#14213D]/30");

export const goldButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#B39262] px-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#14213D] transition-[background-color,translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#a5844f] hover:shadow-[0_8px_18px_-8px_rgba(20,33,61,0.45)] active:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-[#14213D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/* ---------- Label + hint + error wrapper ---------- */
function Shell({ id, label, hideLabel, required, hint, error, className, children }) {
  return (
    <div className={cx("grid gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className={hideLabel ? "sr-only" : "text-[13px] font-medium text-[#14213D]"}>
          {label}
          {required && !hideLabel && <span className="text-[#14213D]"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-[#63524E]">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

const a11y = (id, error, hint) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

/* ---------- Text input ---------- */
export function TextField({ id: idProp, label, hideLabel, hint, error, required, className, ...props }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Shell id={id} label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} className={className}>
      <input id={id} required={required} className={cx(inputBase, "h-12", borderFor(error))} {...a11y(id, error, hint)} {...props} />
    </Shell>
  );
}

/* ---------- Textarea ---------- */
export function TextAreaField({ id: idProp, label, hideLabel, hint, error, required, rows = 6, className, ...props }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Shell id={id} label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={cx(inputBase, "resize-y py-3 leading-relaxed", borderFor(error))}
        {...a11y(id, error, hint)}
        {...props}
      />
    </Shell>
  );
}

/* ---------- Select ---------- */
export function SelectField({ id: idProp, label, hideLabel, hint, error, required, options, placeholder, className, ...props }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Shell id={id} label={label} hideLabel={hideLabel} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          className={cx(inputBase, "h-12 appearance-none pr-10", borderFor(error), !props.value && "text-[#8a7d76]")}
          {...a11y(id, error, hint)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-[#14213D]">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63524E]" />
      </div>
    </Shell>
  );
}

/* ---------- Image upload with preview ---------- */
export function ImageField({ id: idProp, label, hint, error, required, file, onChange, shape = "cover", maxSizeMB = 5, className }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [preview, setPreview] = useState(null);
  const [sizeError, setSizeError] = useState("");

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (picked.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`Image must be under ${maxSizeMB} MB.`);
      return;
    }
    setSizeError("");
    onChange(picked);
  };

  const frame = shape === "round" ? "h-24 w-24 rounded-full" : "aspect-[2/3] w-28 rounded-md";
  const shownError = error || sizeError;

  return (
    <Shell id={id} label={label} required={required} hint={hint} error={shownError} className={className}>
      <div className="flex items-center gap-5">
        <div className={cx("relative shrink-0 overflow-hidden border border-dashed bg-[#EFE7DB]", frame, shownError ? "border-red-600" : "border-[#E4DDD3]")}>
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus aria-hidden="true" className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-[#b9ada2]" />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#E4DDD3] bg-white px-4 py-2 text-[13px] font-medium text-[#14213D] transition-colors hover:border-[#14213D] focus-within:ring-2 focus-within:ring-[#B39262]">
            {file ? "Change image" : "Choose image"}
            <input id={id} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleFile} {...a11y(id, shownError, hint)} />
          </label>
          {file && (
            <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1 text-[13px] text-[#63524E] hover:text-red-700">
              <X aria-hidden="true" className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Checkbox ---------- */
export function CheckboxField({ id: idProp, label, checked, onChange, error }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className="grid gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#14213D]"
          {...a11y(id, error)}
        />
        <label htmlFor={id} className="text-[13px] leading-relaxed text-[#14213D]">{label}</label>
      </div>
      {error && <p id={`${id}-error`} className="pl-7 text-xs text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- Helpers ---------- */
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isUrl = (v) => {
  try {
    return ["http:", "https:"].includes(new URL(v.trim()).protocol);
  } catch {
    return false;
  }
};

// Moves keyboard focus to the first field with an error.
export const focusFirstError = () =>
  requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());