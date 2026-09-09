import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

function normalizeOption(option) {
  return typeof option === "string"
    ? { value: option, label: option }
    : option;
}

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  label,
  ariaLabel,
  testId,
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const normalizedOptions = options.map(normalizeOption);
  const selected = normalizedOptions.find((option) => option.value === value) || normalizedOptions[0];

  useEffect(() => {
    function closeOnOutside(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function choose(option) {
    if (option.disabled) return;
    onChange?.(option.value);
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label && <span className="sr-only">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        data-testid={testId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={`flex min-h-10 w-full items-center justify-between gap-3 rounded border border-white/[0.12] bg-[#111923] px-3 text-left text-sm text-white/80 outline-none transition hover:border-cyan-200/40 focus:border-cyan-200/60 focus:ring-2 focus:ring-cyan-200/15 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
      >
        <span className="truncate">{selected?.label || "Choose an option"}</span>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-white/35 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && !disabled && (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel || label}
          className={`absolute left-0 top-[calc(100%+6px)] z-[80] max-h-64 w-full min-w-[180px] overflow-auto rounded-xl border border-white/[0.14] bg-[#111923] p-1.5 shadow-2xl shadow-black/60 ring-1 ring-cyan-200/[0.05] ${menuClassName}`}
        >
          {normalizedOptions.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === selected?.value}
              key={option.value}
              disabled={option.disabled}
              onClick={() => choose(option)}
              className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-xs transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35 ${option.value === selected?.value ? "bg-cyan-200/[0.08] text-cyan-100" : "text-white/65"}`}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {option.value === selected?.value && <Check className="h-3.5 w-3.5 flex-shrink-0 text-cyan-200" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}