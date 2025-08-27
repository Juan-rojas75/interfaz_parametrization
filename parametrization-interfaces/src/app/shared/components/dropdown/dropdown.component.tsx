"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type Option = { value: string | number; name: string };

export interface DropDownProps {
  title?: string;
  options: Option[];
  value?: Option | null;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  searchable?: boolean; // habilita input para filtrar
  onSelect: (option: Option | null) => void;
  onOpenChange?: (open: boolean) => void;
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function DropDown({
  title,
  options,
  value = null,
  placeholder = "Seleccionar",
  disabled = false,
  error,
  helperText,
  searchable = false,
  onSelect,
  onOpenChange,
}: Readonly<DropDownProps>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Cierra al hacer click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
      onOpenChange?.(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onOpenChange]);

  // Sincroniza índice activo cuando se abre
  useEffect(() => {
    if (open) {
      const idx = value ? filtered.findIndex((o) => o.value === value.value) : -1;
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      setQuery("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selectOption = (opt: Option | null) => {
    onSelect(opt);
    setOpen(false);
    onOpenChange?.(false);
    btnRef.current?.focus();
  };

  const onToggle = () => {
    if (disabled) return;
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  const onKeyDownBtn = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      onOpenChange?.(true);
      setTimeout(() => listRef.current?.querySelector<HTMLElement>("[data-active='true']")?.focus(), 0);
    }
  };

  const onKeyDownOption = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      onOpenChange?.(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) selectOption(opt);
    }
  };

  return (
    <div className="relative inline-block w-full max-w-screen-sm text-left">
      {title && (
        <label className="mb-1 block text-sm font-medium text-primary-900">{title}</label>
      )}

      <div className="flex w-full items-center gap-2">
        {/* Botón principal */}
        <button
          ref={btnRef}
          type="button"
          id="dropdown-button"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={onToggle}
          onKeyDown={onKeyDownBtn}
          className={cx(
            "flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm transition focus:outline-none focus:ring-2",
            disabled && "cursor-not-allowed opacity-60",
            error ? "border-red-400 focus:ring-red-400" : "border-primary-200 focus:ring-primary-400",
            "bg-white text-primary-950"
          )}
        >
          <span className={cx("truncate", !value?.name && "text-primary-800/60")}>{value?.name || placeholder}</span>
          <span className="ml-3 inline-flex shrink-0">
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m7 14l5-5l5 5z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5l5-5z"/></svg>
            )}
          </span>
        </button>

        {/* Clear */}
        {value && (
          <button
            type="button"
            aria-label="Limpiar selección"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-700/70 transition hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
            onClick={() => selectOption(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
          </button>
        )}
      </div>

      {/* Helper / error */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-primary-700/70">{helperText}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Lista */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-labelledby="dropdown-button"
          tabIndex={-1}
          onKeyDown={onKeyDownOption}
          className="absolute left-0 z-50 mt-2 w-full origin-top-left overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-lg"
        >
          {/* Search */}
          {searchable && (
            <div className="border-b border-secondary-200 p-2">
              <input
                autoFocus
                placeholder="Buscar…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-secondary-300 bg-white p-2 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          )}

          <div className={cx("max-h-60 overflow-auto p-1", !filtered.length && "p-2") }>
            {filtered.length === 0 && (
              <div className="select-none px-2 py-3 text-center text-sm text-primary-800/70">Sin resultados</div>
            )}
            {filtered.map((opt, i) => {
              const selected = value?.value === opt.value;
              const active = i === activeIndex || selected;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  data-active={active}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectOption(opt)}
                  className={cx(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                    active ? "bg-primary-50 text-primary-900" : "text-primary-900 hover:bg-secondary-100"
                  )}
                >
                  <span className="truncate">{opt.name}</span>
                  {selected && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
