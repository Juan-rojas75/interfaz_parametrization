"use client";

import React from "react";
import { ItemType } from "../DragDrop/drag-drop.component";

interface FieldsSummaryProps {
  fields: ItemType[];
}

function getTipoLabel(type?: string): string {
  const tipos: Record<string, string> = {
    string: "Texto",
    number: "Número",
    date: "Fecha",
    boolean: "Booleano",
    email: "Email",
  };
  if (!type) return "-";
  return tipos[type] ?? type;
}

function fmt(v: unknown): string {
  if (v === undefined || v === null || v === "") return "-";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const map: Record<typeof tone, string> = {
    neutral: "bg-secondary-100 text-primary-900 border-secondary-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}

function Chips({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-primary-800/60">-</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="rounded-full bg-secondary-50 px-2 py-0.5 text-xs text-primary-900 border border-secondary-200"
          title={t}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function TableRow({ field }: { field: ItemType }) {
  const cfg = field.config;
  const transformList = cfg?.transformation?.map((t) => t?.replace).filter(Boolean) ?? [];

  return (
    <tr className="odd:bg-white even:bg-secondary-50 hover:bg-primary-50 transition-colors">
      <td className="px-3 py-2 font-medium text-primary-950">{fmt(field.name)}</td>
      <td className="px-3 py-2">{fmt(cfg?.name)}</td>
      <td className="px-3 py-2">{fmt(cfg?.link_name)}</td>
      <td className="px-3 py-2">{fmt(cfg?.default)}</td>
      <td className="px-3 py-2">{fmt(cfg?.size)}</td>
      <td className="px-3 py-2">
        <Badge tone="info">{getTipoLabel(cfg?.type)}</Badge>
      </td>
      <td className="px-3 py-2">{fmt(cfg?.format_date)}</td>
      <td className="px-3 py-2">
        {cfg?.align ? <Badge tone="neutral">{cfg.align}</Badge> : <span className="text-primary-800/60">-</span>}
      </td>
      <td className="px-3 py-2">
        <Chips items={transformList as string[]} />
      </td>
      <td className="px-3 py-2">
        {cfg?.completed ? <Badge tone="success">Completado</Badge> : <Badge tone="warning">Pendiente</Badge>}
      </td>
    </tr>
  );
}

export function FieldsSummary({ fields }: FieldsSummaryProps) {
  const hasRows = fields && fields.length > 0;

  return (
    <section className="w-full rounded-2xl border border-secondary-200 bg-white shadow-sm">
      <header className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-lg font-semibold text-primary-950">Resumen de campos</h2>
          <p className="text-xs text-primary-800/70">Vista previa de la configuración aplicada a cada campo.</p>
        </div>
        <Badge tone="neutral">
          Total: <span className="ml-1 font-semibold">{fields?.length ?? 0}</span>
        </Badge>
      </header>

      {!hasRows ? (
        <div className="grid place-items-center p-10 text-sm text-primary-800/70">
          No hay campos configurados aún.
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10 bg-secondary-100/70 backdrop-blur supports-[backdrop-filter]:bg-secondary-100/50">
              <tr className="text-sm text-primary-800">
                <th className="px-3 py-2 font-semibold min-w-[10rem]">Campo</th>
                <th className="px-3 py-2 font-semibold min-w-[10rem]">Nombre</th>
                <th className="px-3 py-2 font-semibold min-w-[10rem]">Link name</th>
                <th className="px-3 py-2 font-semibold min-w-[10rem]">Predeterminado</th>
                <th className="px-3 py-2 font-semibold min-w-[8rem]">Tamaño</th>
                <th className="px-3 py-2 font-semibold min-w-[8rem]">Tipo</th>
                <th className="px-3 py-2 font-semibold min-w-[12rem]">Formato fecha</th>
                <th className="px-3 py-2 font-semibold min-w-[8rem]">Alineación</th>
                <th className="px-3 py-2 font-semibold min-w-[14rem]">Transformación</th>
                <th className="px-3 py-2 font-semibold min-w-[8rem]">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {fields.map((f) => (
                <TableRow key={f.id} field={f} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
