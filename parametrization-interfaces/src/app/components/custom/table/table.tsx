"use client";
import React, { useMemo } from "react";
import Button from "@/app/shared/components/button/button.component";
import Paginator from "../paginator/paginator";
import { formatValue } from "@/app/utils/formatValue.util";

/**
 * Tabla mejorada (UX/UI)
 * - Contenedor con card, header sticky, zebra rows, hover, focus-visible
 * - Estados: loading (skeleton), vacío, error opcional
 * - Soporta sorteo simple en columnas (onSort / sortState)
 * - Acciones por fila y botón Agregar flotante en mobile
 * - Accesible (roles/aria), responsive (scroll-x), truncate + tooltips
 *
 * Props compatibles con la tabla original + opcionales:
 * - loading?: boolean
 * - emptyMessage?: string
 * - error?: string
 * - onSort?: (field: string) => void
 * - sortState?: { field: string; direction: "asc" | "desc" }
 * - dense?: boolean (altura de filas)
 */

export interface Column {
  id: number;
  name: string;
  field: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
  width?: string; // ej: '10rem' | 'auto'
}

export interface TableProps {
  columns: Column[];
  paginator: any;
  data: any[];
  actions: { add?: boolean; edit?: boolean; delete?: boolean };
  addClick: () => void;
  editClick: (row: any) => void;
  deleteClick: (row: any) => void;
  pageClick: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  error?: string;
  onSort?: (field: string) => void;
  sortState?: { field: string; direction: "asc" | "desc" };
  dense?: boolean;
}

export function Table({
  columns,
  paginator,
  data,
  actions,
  addClick,
  editClick,
  deleteClick,
  pageClick,
  loading = false,
  emptyMessage = "No hay resultados",
  error,
  onSort,
  sortState,
  dense = false,
}: Readonly<TableProps>) {
  const rowHeight = dense ? "h-10" : "h-12";
  const hasActions = !!actions?.edit || !!actions?.delete;

  const skeletonRows = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <article className="relative">
      <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-secondary-200 p-4">
          <h3 className="text-base font-semibold text-primary-950">Listado</h3>
          <div className="hidden sm:block">
            <Button severity="primary" active={!!actions?.add} onClick={addClick}>
              Agregar
            </Button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border-b border-red-100">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left" role="table">
            <thead className="sticky top-0 z-10 bg-secondary-50/80 backdrop-blur">
              <tr role="row">
                {columns.map((column) => {
                  const isSorted = sortState?.field === column.field;
                  const dir = isSorted ? sortState?.direction : undefined;
                  const align = column.align ?? "left";
                  return (
                    <th
                      key={column.id}
                      role="columnheader"
                      scope="col"
                      className={`min-w-[10rem] ${column.width ? "" : "lg:min-w-[12rem]"} px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-800 select-none ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
                      style={{ width: column.width }}
                    >
                      <div className={`inline-flex items-center gap-1 ${onSort && column.sortable ? "cursor-pointer" : "cursor-default"}`}
                           onClick={() => onSort && column.sortable && onSort(column.field)}
                           title={column.sortable ? "Ordenar" : undefined}
                           aria-sort={isSorted ? (dir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        <span>{column.name}</span>
                        {column.sortable && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className={`transition ${isSorted ? "text-primary-900" : "text-primary-600/60"}`} aria-hidden>
                            {dir === "asc" && <path fill="currentColor" d="M7 14l5-5l5 5z"/>}
                            {dir === "desc" && <path fill="currentColor" d="M7 10l5 5l5-5z"/>}
                            {!dir && <path fill="currentColor" d="M7 10l5 5l5-5z"/>}
                          </svg>
                        )}
                      </div>
                    </th>
                  );
                })}
                {hasActions && (
                  <th className="min-w-[10rem] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-800">Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Loading skeleton */}
              {loading && (
                skeletonRows.map((_, i) => (
                  <tr key={`sk-${i}`} className={`${rowHeight}`}>
                    {columns.map((c) => (
                      <td key={`sk-${i}-${c.id}`} className="px-4">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-secondary-200"/>
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-4">
                        <div className="h-8 w-24 animate-pulse rounded bg-secondary-200"/>
                      </td>
                    )}
                  </tr>
                ))
              )}

              {/* Empty state */}
              {!loading && (!data || data.length === 0) && (
                <tr>
                  <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-6 py-10 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-secondary-100"/>
                      <p className="text-sm font-medium text-primary-900">{emptyMessage}</p>
                      {actions?.add && (
                        <div className="mt-4">
                          <Button severity="primary" active onClick={addClick}>Agregar</Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading && data && data.length > 0 && (
                data.map((row) => (
                  <tr key={row.id || row._id} className={`border-t border-secondary-100 ${rowHeight} odd:bg-white even:bg-secondary-50/40 hover:bg-primary-50/40 focus-within:bg-primary-50/60 transition-colors`}>
                    {columns.map((column) => {
                      const value = row[column.field];
                      const align = column.align ?? "left";
                      const cell = column.render ? column.render(value, row) : formatValue(value);
                      return (
                        <td key={column.id} className={`px-4 text-sm text-primary-900 ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`} title={typeof value === "string" ? value : undefined}>
                          <div className="max-w-[38rem] truncate">{cell}</div>
                        </td>
                      );
                    })}

                    {hasActions && (
                      <td className="px-4 text-sm">
                        <div className="flex flex-wrap gap-2 max-w-24">
                          {actions.edit && (
                            <Button severity="primary" active onClick={() => editClick(row)}>Editar</Button>
                          )}
                          {actions.delete && (
                            <Button severity="danger" active onClick={() => deleteClick(row)}>Eliminar</Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con paginador */}
        <div className="flex items-center justify-between gap-4 border-t border-secondary-200 p-3">
          <div className="text-xs text-primary-700/70">{paginator?.total ?? 0} registros</div>
          <Paginator paginator={paginator} changePage={pageClick} />
        </div>
      </div>

      {/* Botón agregar flotante en móvil */}
      {actions?.add && (
        <div className="fixed bottom-6 right-6 z-10 sm:hidden">
          <button
            onClick={addClick}
            aria-label="Agregar"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2z"/></svg>
          </button>
        </div>
      )}
    </article>
  );
}
