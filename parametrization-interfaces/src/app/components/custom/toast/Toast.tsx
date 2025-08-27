"use client";
import { JSX, useEffect, useRef } from "react";
import { useToast } from "@/app/context/ToastContext";

/**
 * Toast mejorado (accesible + variantes + autocierre)
 * - Variantes: success | info | warning | error
 * - Autocierre con barra de progreso (si toast.duration)
 * - Animaciones de entrada/salida, respeta prefers-reduced-motion
 * - Accesible: role, aria-live, close button con label
 * - Soporta acciones opcionales en el toast (toast.action)
 *
 * Espera que cada toast tenga forma:
 * { id: string; title?: string; message: string; type?: 'success'|'info'|'warning'|'error'; duration?: number; action?: { label: string; onClick: () => void } }
 */

const ICONS: Record<string, JSX.Element> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.212 8.1T22 12t-.788 3.9t-2.137 3.175T15.9 21.212T12 22m-1.4-5.6l7.05-7.05l-1.4-1.4L10.6 13.6L7.75 10.75l-1.4 1.4z"/>
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M11 17h2v-6h-2zm0-8h2V7h-2z"/>
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"/>
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M1 21h22L12 2zM12 16v-4m0 8h.01"/>
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m3.59 12L12 10.41L8.41 14L7 12.59L10.59 9L7 5.41L8.41 4L12 7.59L15.59 4L17 5.41L13.41 9L17 12.59z"/>
    </svg>
  ),
};

export default function Toast() {
  const { toasts, removeToast } = useToast();
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    // configurar autocierre
    toasts.forEach((t: any) => {
      if (t.duration && !timers.current[t.id]) {
        timers.current[t.id] = window.setTimeout(() => removeToast(t.id), t.duration);
      }
    });
    // limpiar timers eliminados
    return () => {
      Object.values(timers.current).forEach((id) => window.clearTimeout(id));
      timers.current = {};
    };
  }, [toasts, removeToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1100] mx-auto flex w-full max-w-xl flex-col gap-3 px-4 sm:right-4 sm:left-auto sm:mx-0">
      {toasts.map((toast: any) => {
        const type = toast.type || "info";
        return (
          <div
            key={toast.id}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={`pointer-events-auto relative overflow-hidden rounded-xl border p-3 pr-10 shadow-lg backdrop-blur transition motion-safe:animate-in slide-in-from-top-2 fade-in duration-150 ${
              type === "success" && "border-green-200 bg-green-50 text-green-900"
            } ${type === "info" && "border-blue-200 bg-blue-50 text-blue-900"} ${
              type === "warning" && "border-amber-200 bg-amber-50 text-amber-900"
            } ${type === "error" && "border-red-200 bg-red-50 text-red-900"}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{ICONS[type]}</div>
              <div className="min-w-0 flex-1">
                {toast.title && (
                  <strong className="block text-sm font-semibold leading-5">{toast.title}</strong>
                )}
                <p className="text-sm leading-5 text-black/70 line-clamp-3">{toast.message}</p>
                {toast.action && (
                  <div className="mt-2">
                    <button
                      onClick={() => toast.action.onClick?.()}
                      className="inline-flex items-center rounded-md border border-black/10 bg-white/70 px-2 py-1 text-xs font-medium text-black/70 backdrop-blur transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-black/60 transition hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20"
                aria-label="Cerrar notificación"
                title="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M18.3 5.71L12 12.01l-6.3-6.3L4.29 7.12l6.3 6.3l-6.3 6.3l1.41 1.41l6.3-6.3l6.3 6.3l1.41-1.41l-6.3-6.3l6.3-6.3z"/>
                </svg>
              </button>
            </div>

            {/* Barra de progreso */}
            {toast.duration && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black/5">
                <div
                  className="h-full bg-black/30 motion-safe:animate-progress"
                  style={{ animationDuration: `${toast.duration}ms` }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Utilidades de animación */}
      <style jsx global>{`
        .animate-in { animation-name: var(--tw-enter-animation) }
        .slide-in-from-top-2 { --tw-enter-animation: slideInFromTop; }
        .fade-in { --tw-enter-animation: fadeIn; }
        @keyframes slideInFromTop { from { transform: translateY(-8px); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        .motion-safe\\:animate-in { animation: fadeIn .12s ease-out both, slideInFromTop .18s ease-out both; }
        .motion-safe\\:animate-progress { animation: progress linear forwards; }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-in { animation: none !important; }
          .motion-safe\\:animate-progress { animation: none !important; }
        }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
