"use client";
import { useEffect } from "react";
import { useLoading } from "@/app/context/loaderContext";

/**
 * Loader mejorado (accesible + elegante)
 * - Overlay con blur y fade
 * - Soporta mensaje y porcentaje (determinado/indeterminado)
 * - Accesible: role="status", aria-live, sr-only
 * - Respeta reduce motion
 * - Bloquea scroll del body mientras está activo
 */

export default function Loader() {
  const loader = useLoading() as Partial<{ isLoading: boolean; message: string; progress: number | null }>;
  const isLoading = !!loader?.isLoading;
  const message = loader?.message;
  const progress = loader?.progress;

  // Mantener el orden de hooks estable: siempre declaramos useEffect
  useEffect(() => {
    if (!isLoading) return; // sólo actúa cuando está cargando
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isLoading]);

  const isDeterminate = typeof progress === "number" && progress >= 0 && progress <= 100;

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/40 backdrop-blur-sm transition-opacity motion-safe:animate-fadeIn"
          role="status"
          aria-live="polite"
          aria-label={message || "Cargando"}
        >
          <div className="relative flex w-[min(520px,92vw)] flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/90 p-6 text-primary-900 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-neutral-900/80 dark:text-neutral-50">
            {/* Spinner / barra */}
            <div className="relative grid place-items-center">
              {!isDeterminate ? (
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 rounded-full border-4 border-white/40 dark:border-white/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 motion-safe:animate-spin" />
                </div>
              ) : (
                <div className="w-64 max-w-[80vw] overflow-hidden rounded-full border border-primary-200 bg-primary-50">
                  <div
                    className="h-2 bg-primary-600 transition-[width] duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    role="progressbar"
                  />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium tracking-tight">{message || (isDeterminate ? "Procesando…" : "Cargando…")}</p>
              {isDeterminate && <p className="mt-1 text-xs text-primary-700/70 dark:text-neutral-300/70">{progress}%</p>}
              <span className="sr-only">Por favor, espera.</span>
            </div>
            <div className="text-[11px] text-primary-700/60 dark:text-neutral-300/60">
              {isDeterminate ? "No cierres esta ventana mientras finaliza." : "Optimizando recursos…"}
            </div>
          </div>
          <style jsx global>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            .animate-fadeIn { animation: fadeIn .15s ease-out both }
            @media (prefers-reduced-motion: reduce) {
              .motion-safe\\:animate-spin { animation: none !important; }
              .animate-fadeIn { animation: none !important; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
