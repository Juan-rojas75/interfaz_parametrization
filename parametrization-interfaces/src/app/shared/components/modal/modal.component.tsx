"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "fullscreen";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode; // Botones de acción
  size?: ModalSize;
  preventCloseOnBackdrop?: boolean; // Evita cerrar al hacer click fuera
  closeOnEsc?: boolean; // Esc para cerrar
  initialFocusRef?: React.RefObject<HTMLElement>; // Enfocar un elemento al abrir
  hideCloseButton?: boolean;
  className?: string; // clases extra para el panel
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  preventCloseOnBackdrop = false,
  closeOnEsc = true,
  initialFocusRef,
  hideCloseButton = false,
  className,
}: Readonly<ModalProps>) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Bloquear scroll del body cuando esté abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Guardar y restaurar foco del disparador
  useLayoutEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement;
      // Enfocar panel o el initialFocusRef
      setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else {
          panelRef.current?.focus();
        }
      }, 0);
    } else if (lastActiveRef.current) {
      lastActiveRef.current.focus();
    }
  }, [open, initialFocusRef]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  // Focus trap básico (Tab cíclico dentro del modal)
  useEffect(() => {
    if (!open) return;
    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const panelMax =
    size === "sm"
      ? "max-w-md"
      : size === "md"
      ? "max-w-lg"
      : size === "lg"
      ? "max-w-2xl"
      : size === "xl"
      ? "max-w-4xl"
      : "w-screen h-screen";

  const handleBackdrop = (e: React.MouseEvent) => {
    if (preventCloseOnBackdrop) return;
    if (e.target === overlayRef.current) onClose();
  };

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/40 backdrop-blur-sm motion-safe:animate-fadeIn"
      onMouseDown={handleBackdrop}
      aria-hidden={false}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cx(
          "relative max-h-[85vh] w-[92vw] overflow-auto rounded-2xl border border-white/10 bg-white p-0 text-primary-950 shadow-2xl outline-none transition dark:bg-neutral-900 dark:text-neutral-50",
          size === "fullscreen" ? "h-[92vh]" : panelMax,
          "motion-safe:animate-scaleIn",
          className
        )}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-secondary-200 bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/80">
            <h2 className="text-base font-semibold leading-6">{title}</h2>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-800/70 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.6 4.6l-1.4-1.4l4.6-4.6L6 7.4l1.4-1.4l4.6 4.6l4.6-4.6l1.4 1.4l-4.6 4.6l4.6 4.6l-1.4 1.4z"/></svg>
              </button>
            )}
          </header>
        )}

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && <footer className="sticky bottom-0 border-t border-secondary-200 bg-white/90 p-3 backdrop-blur dark:bg-neutral-900/80">{footer}</footer>}
      </div>

      {/* Animaciones utilitarias */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(.98); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .animate-fadeIn { animation: fadeIn .14s ease-out both }
        .animate-scaleIn { animation: scaleIn .14s ease-out both }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-fadeIn, .motion-safe\\:animate-scaleIn { animation: none !important; }
        }
      `}</style>
    </div>
  );

  // Portal para evitar conflictos de stacking
  if (typeof window === "undefined") return modal;
  const mount = document.body;
  return createPortal(modal, mount);
}
