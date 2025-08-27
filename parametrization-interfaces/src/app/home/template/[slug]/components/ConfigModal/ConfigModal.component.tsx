"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import Modal from "@/app/shared/components/modal/modal.component";
import Button from "@/app/shared/components/button/button.component";
import { dateFormats } from "./const/date.const";
import { typesOptions } from "./const/type.const";
import { completedOptions } from "./const/completed.const";
import { alignOptions } from "./const/align.const";
import type { FieldConfig } from "./interfaces/FieldConfig.interface";
import type { FieldConfigModalProps } from "./interfaces/ConfigModal.interface";

export default function FieldConfigModal({ field, onSave, onCancel }: Readonly<FieldConfigModalProps>) {
  // Estado base del form (controlado)
  const [config, setConfig] = useState<FieldConfig>(() => ({
    name: field.config?.name ?? "",
    link_name: field.config?.link_name ?? "",
    default: field.config?.default ?? "",
    size: field.config?.size ?? 0,
    type: field.config?.type,
    format_date: field.config?.format_date,
    align: field.config?.align,
    completed: field.config?.completed,
    transformation: field.config?.transformation ?? undefined,
  }));

  // Para permitir vacío en number sin romper control
  const [sizeInput, setSizeInput] = useState<string>(field.config?.size?.toString() ?? "");

  // Transformaciones (si hay valuesDefault)
  const [transformation, setTransformation] = useState<{ default: string; replace: string }[]>(
    field.config?.transformation
      ? field.config.transformation
      : field.valuesDefault
      ? field.valuesDefault.map((v) => ({ default: v.name, replace: "" }))
      : []
  );

  // Errores por campo
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Re-sincroniza cuando cambie el field (abrir/editar otro campo)
  useEffect(() => {
    setConfig({
      name: field.config?.name ?? "",
      link_name: field.config?.link_name ?? "",
      default: field.config?.default ?? "",
      size: field.config?.size ?? 0,
      type: field.config?.type,
      format_date: field.config?.format_date,
      align: field.config?.align,
      completed: field.config?.completed,
      transformation: field.config?.transformation ?? undefined,
    });
    setSizeInput(field.config?.size?.toString() ?? "");
    if (field.valuesDefault) {
      setTransformation(
        field.config?.transformation
          ? field.config.transformation
          : field.valuesDefault.map((v) => ({ default: v.name, replace: "" }))
      );
    } else {
      setTransformation(field.config?.transformation ?? []);
    }
    setErrors({});
  }, [field]);

  // Validación simple
  const validate = useCallback((data: FieldConfig) => {
    const e: Record<string, string> = {};
    if (!data.name?.trim()) e.name = "El nombre es obligatorio.";
    if (!data.link_name?.trim()) e.link_name = "El link name es obligatorio.";
    if (sizeInput !== "") {
      const n = Number(sizeInput);
      if (!Number.isFinite(n) || n < 0) e.size = "El tamaño debe ser un número mayor o igual a 0.";
    }
    if (data.type === "date" && !data.format_date) e.format_date = "Selecciona un formato de fecha.";
    return e;
  }, [sizeInput]);

  useEffect(() => {
    setErrors(validate(config));
  }, [config, sizeInput, validate]);

  const canSave = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSizeInput(v);
    setConfig((prev) => ({ ...prev, size: v === "" ? 0 : Number(v) }));
  };

  const handleSelectChange = (key: keyof FieldConfig, option: { value: string | number; name: string } | null) => {
    setConfig((prev) => ({ ...prev, [key]: option?.value as any }));
  };

  const handleTransformationChange = (index: number, newValue: string) => {
    setTransformation((prev) => prev.map((it, i) => (i === index ? { ...it, replace: newValue } : it)));
  };

  // Vincula transformación al config
  useEffect(() => {
    setConfig((prev) => ({ ...prev, transformation: transformation.length ? transformation : undefined }));
  }, [transformation]);

  const handleSave = () => {
    const e = validate(config);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave(field.id, {
      ...config,
      size: sizeInput === "" ? 0 : Number(sizeInput),
    });
  };

  return (
    <Modal
      open={true}
      onClose={onCancel}
      title="Configurar Campo"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button severity="secondary" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button severity="primary" onClick={handleSave} disabled={!canSave}>Guardar</Button>
        </div>
      }
    >
      <div className="w-full max-w-2xl">
        {/* Grid de 2 columnas en md+ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre del campo</label>
            <input
              id="name"
              name="name"
              type="text"
              value={config.name ?? ""}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              className={`w-full rounded-lg border bg-white p-2 text-sm focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-400 focus:ring-red-400" : "border-secondary-300 focus:ring-primary-400"
              }`}
              placeholder="Ej: Código de cliente"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Link name */}
          <div>
            <label htmlFor="link_name" className="mb-1 block text-sm font-medium">Link name</label>
            <input
              id="link_name"
              name="link_name"
              type="text"
              value={config.link_name ?? ""}
              onChange={handleChange}
              aria-invalid={!!errors.link_name}
              className={`w-full rounded-lg border bg-white p-2 text-sm focus:outline-none focus:ring-2 ${
                errors.link_name ? "border-red-400 focus:ring-red-400" : "border-secondary-300 focus:ring-primary-400"
              }`}
              placeholder="Nombre en origen"
            />
            {errors.link_name && <p className="mt-1 text-xs text-red-500">{errors.link_name}</p>}
          </div>

          {/* Default */}
          <div>
            <label htmlFor="default" className="mb-1 block text-sm font-medium">Valor predeterminado</label>
            <input
              id="default"
              name="default"
              type="text"
              value={config.default ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-secondary-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="(Opcional)"
            />
            <p className="mt-1 text-[11px] text-primary-800/70">Se usará si el valor viene vacío.</p>
          </div>

          {/* Tamaño */}
          <div>
            <label htmlFor="size" className="mb-1 block text-sm font-medium">Tamaño</label>
            <input
              id="size"
              name="size"
              type="number"
              inputMode="numeric"
              value={sizeInput}
              onChange={handleSizeChange}
              aria-invalid={!!errors.size}
              className={`w-full rounded-lg border bg-white p-2 text-sm focus:outline-none focus:ring-2 ${
                errors.size ? "border-red-400 focus:ring-red-400" : "border-secondary-300 focus:ring-primary-400"
              }`}
              placeholder="0"
            />
            {errors.size
              ? <p className="mt-1 text-xs text-red-500">{errors.size}</p>
              : <p className="mt-1 text-[11px] text-primary-800/70">Longitud del campo en el archivo.</p>}
          </div>

          {/* Tipo */}
          <div className="md:col-span-1">
            <DropDown
              title="Tipo de dato"
              options={typesOptions}
              value={typesOptions.find((t) => t.value === config.type) || null}
              onSelect={(option) => handleSelectChange("type", option)}
              helperText="Selecciona el tipo de dato esperado."
            />
            {config.type === "date" && errors.format_date && (
              <p className="mt-1 text-xs text-red-500">{errors.format_date}</p>
            )}
          </div>

          {/* Formato fecha */}
          {config.type === "date" && (
            <div className="md:col-span-1">
              <DropDown
                title="Formato de fecha"
                options={dateFormats}
                value={dateFormats.find((f) => f.value === config.format_date) || null}
                onSelect={(option) => handleSelectChange("format_date", option)}
                helperText="Ej.: dd/MM/yyyy, yyyy-MM-dd, etc."
              />
            </div>
          )}

          {/* Completed */}
          <div className="md:col-span-1">
            <DropDown
              title="Completar con"
              options={completedOptions}
              value={completedOptions.find((c) => c.value === config.completed) || null}
              onSelect={(option) => handleSelectChange("completed", option)}
              helperText="Caracter usado para rellenar."
            />
          </div>

          {/* Align */}
          <div className="md:col-span-1">
            <DropDown
              title="Alinear"
              options={alignOptions}
              value={alignOptions.find((a) => a.value === config.align) || null}
              onSelect={(option) => handleSelectChange("align", option)}
              helperText="Alineación del contenido al exportar."
            />
          </div>
        </div>

        {/* Transformación */}
        {field.valuesDefault && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">Transformación</h3>
            <p className="mb-2 text-[11px] text-primary-800/70">
              Reemplaza valores de origen por nuevos valores.
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {transformation.map((item, idx) => (
                <div key={`${item.default}-${idx}`} className="rounded-lg border border-secondary-200 bg-white p-2">
                  <span className="block text-xs font-semibold text-primary-800">Origen</span>
                  <div className="mb-2 rounded-md bg-secondary-50 px-2 py-1 text-sm">{item.default}</div>
                  <label className="mb-1 block text-xs text-primary-800">Reemplazar por</label>
                  <input
                    type="text"
                    value={item.replace}
                    onChange={(e) => handleTransformationChange(idx, e.target.value)}
                    placeholder="Nuevo valor"
                    className="w-full rounded-lg border border-secondary-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
