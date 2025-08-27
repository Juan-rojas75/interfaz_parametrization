"use client";
import React, { useMemo } from "react";
import type { Paginator as PaginatorType } from "./interfaces/paginator.interface";

/**
 * Paginator mejorado (accesible + responsive)
 * - Botones: Primero, Anterior, páginas con elipsis, Siguiente, Último
 * - Estados disabled/active claros, accesibilidad (aria-label, aria-current)
 * - Muestra rango "Mostrando X–Y de Z"
 * - Mantiene compatibilidad con props recibidas
 */

export default function PaginatorPage({ paginator, changePage }: Readonly<PaginatorType>) {
  const { page, pages, items_per_page, total } = paginator;

  // Rango visible de páginas con elipsis
  const visiblePages = useMemo(() => {
    const windowSize = 1; // páginas a cada lado del current
    const items: (number | "ellipsis")[] = [];
    const push = (v: number | "ellipsis") => items.push(v);

    const start = Math.max(1, page - windowSize);
    const end = Math.min(pages, page + windowSize);

    if (start > 1) {
      push(1);
      if (start > 2) push("ellipsis");
    }

    for (let p = start; p <= end; p++) push(p);

    if (end < pages) {
      if (end < pages - 1) push("ellipsis");
      push(pages);
    }

    return items;
  }, [page, pages]);

  // Cálculo de rango mostrado (1-indexed)
  const rangeStart = Math.min((page - 1) * items_per_page + 1, Math.max(total, 1));
  const rangeEnd = Math.min(page * items_per_page, total);

  // Helpers de clase
  const baseBtn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-transparent px-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-400";
  const ghostBtn =
    "bg-primary-100 text-primary-800 hover:bg-primary-200 hover:text-primary-900 disabled:opacity-40 disabled:hover:bg-primary-100 disabled:cursor-not-allowed";
  const solidBtn =
    "bg-primary-500 text-white shadow-sm hover:bg-primary-600";

  return (
    <article className="flex flex-wrap items-center justify-between gap-3">
      {/* Rango y total */}
      <div className="text-xs text-primary-700/80">
        {total > 0 ? (
          <>Mostrando <span className="font-semibold">{rangeStart}–{rangeEnd}</span> de {total}</>
        ) : (
          <>Sin resultados</>
        )}
      </div>

      {/* Controles */}
      <nav className="flex items-center gap-2" aria-label="Paginación" role="navigation">
        {/* Primero */}
        <button
          type="button"
          onClick={() => changePage(1)}
          disabled={page <= 1}
          className={`${baseBtn} ${ghostBtn}`}
          aria-label="Primera página"
        >
          «
        </button>

        {/* Anterior */}
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={page <= 1}
          className={`${baseBtn} ${ghostBtn}`}
          aria-label="Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M15.4 7.4L14 6l-6 6l6 6l1.4-1.4L10.8 12z"/>
          </svg>
        </button>

        {/* Páginas */}
        <ul className="flex items-center gap-1" role="list">
          {visiblePages.map((p, idx) =>
            p === "ellipsis" ? (
              <li key={`e${idx}`} className="px-1 text-primary-700/60">…</li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => changePage(p)}
                  className={`${baseBtn} ${p === page ? solidBtn : ghostBtn}`}
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`Ir a página ${p}`}
                >
                  {p}
                </button>
              </li>
            )
          )}
        </ul>

        {/* Siguiente */}
        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={page >= pages}
          className={`${baseBtn} ${ghostBtn}`}
          aria-label="Página siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M8.6 16.6L10 18l6-6l-6-6l-1.4 1.4L13.2 12z"/>
          </svg>
        </button>

        {/* Último */}
        <button
          type="button"
          onClick={() => changePage(pages)}
          disabled={page >= pages}
          className={`${baseBtn} ${ghostBtn}`}
          aria-label="Última página"
        >
          »
        </button>
      </nav>
    </article>
  );
}
