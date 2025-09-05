"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { apiGet } from "@/app/lib/api";
import Button from "@/app/shared/components/button/button.component";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import type { Option } from "@/app/shared/components/dropdown/interfaces/OptionItem.interface";

type TemplateDto = { id: string; name: string; extension: string };

export default function UploadFile() {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // archivo
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // selects
  const [customers, setCustomers] = useState<Option[]>([]);
  const [customer, setCustomer] = useState<Option | null>(null);

  const [templates, setTemplates] = useState<Option[]>([]);
  const [templatesRaw, setTemplatesRaw] = useState<TemplateDto[]>([]);
  const [template, setTemplate] = useState<Option | null>(null);

  // extensión esperada (por plantilla)
  const expectedExt = useMemo(() => {
    const t = templatesRaw.find((t) => t.id === String(template?.value));
    return (t?.extension ?? "xlsx").toLowerCase();
  }, [template, templatesRaw]);

  // accept dinámico
  const acceptAttr = useMemo(() => {
    return `.xlsx , .txt`;
  }, [expectedExt]);

  const revokeRef = useRef<string | null>(null);

  const revokePreview = () => {
    if (revokeRef.current) {
      URL.revokeObjectURL(revokeRef.current);
      revokeRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokePreview(); // cleanup al desmontar
  }, []);

  const validateFile = (f: File): string | null => {
    // tamaño máx 10MB (ajusta si necesitas)
    const MAX = 10 * 1024 * 1024;
    if (f.size > MAX) return "El archivo supera los 10MB.";
    const name = f.name.toLowerCase();
    // const ext = name.split(".").pop() || "";
    // if (expectedExt && ext !== expectedExt) {
    //   return `La plantilla seleccionada espera un .${expectedExt}`;
    // }
    return null;
  };

  const setSelectedFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      showToast(err, "warning");
      return;
    }
    revokePreview();
    const url = URL.createObjectURL(f);
    revokeRef.current = url;
    setFile(f);
    setPreviewUrl(url);
  };

  // input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };

  // drag & drop
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setSelectedFile(f);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    revokePreview();
    setFile(null);
    setPreviewUrl(null);
  };

  // fetch customers
  const fetchCustomers = useCallback(async (signal: AbortSignal) => {
    showLoader();
    try {
      const response = await apiGet(`/customers?page=1&limit=0`);
      const customersData: Option[] = (response?.data ?? []).map((c: any) => ({
        name: c.name,
        value: c._id,
      }));
      setCustomers(customersData);
    } catch {
      showToast("No se pudieron cargar los clientes.", "error");
    } finally {
      hideLoader();
    }
  }, []);

  // fetch templates por cliente
  const fetchTemplates = useCallback(async (customerId: string, signal: AbortSignal) => {
    if (!customerId) return;
    showLoader();
    try {
      const response: TemplateDto[] = await apiGet(`/templates/templates_by_customer/${customerId}`);
      const opts: Option[] = response.map((t) => ({ name: t.name, value: t.id }));
      setTemplates(opts);
      setTemplatesRaw(response);
      // reset selección de plantilla y archivo si cambia cliente
      setTemplate(null);
      clearFile();
    } catch {
      showToast("No se pudieron cargar las plantillas.", "error");
    } finally {
      hideLoader();
    }
  }, []);

  // inicial
  useEffect(() => {
    const ac = new AbortController();
    fetchCustomers(ac.signal);
    return () => ac.abort();
  }, [fetchCustomers]);

  // cuando cambia cliente
  useEffect(() => {
    const ac = new AbortController();
    if (customer?.value) fetchTemplates(String(customer.value), ac.signal);
    return () => ac.abort();
  }, [customer, fetchTemplates]);

  // cuando cambia plantilla → validar archivo ya seleccionado
  useEffect(() => {
    if (file) {
      const err = validateFile(file);
      if (err) {
        showToast(err, "warning");
        clearFile();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expectedExt]);

  // submit
  const handleSubmit = async () => {
    if (!file) return showToast("Selecciona un archivo antes de continuar.", "warning");
    if (!customer) return showToast("Selecciona un cliente.", "warning");
    if (!template) return showToast("Selecciona una plantilla.", "warning");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_template", String(template.value));
    formData.append("id_customer", String(customer.value));

    showLoader();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_FLASK}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir el archivo");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Archivo procesado.${expectedExt || "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      showToast("Archivo procesado con éxito. Descargando…", "success");
    } catch (e) {
      showToast("Hubo un error al procesar el archivo.", "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <article className="flex min-h-screen w-full flex-col gap-10 p-8">
      <section className="relative rounded-2xl border border-secondary-200 bg-gradient-to-br from-secondary-100 to-secondary-200 p-6 sm:p-8">
        <nav className="text-xs text-primary-700/80" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li className="cursor-default hover:underline">Core</li>
            <li>•</li>
            <li className="font-medium text-primary-900">Generar archivo</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-left text-3xl font-bold text-primary-950">Generar archivo</h1>
        <p className="max-w-2xl text-sm text-primary-800/80">Selecciona cliente, plantilla y carga el archivo.</p>
      </section>

      <article className="flex w-full flex-col items-center justify-center gap-6">
        <div className="w-full max-w-xl space-y-4">
          <DropDown
            title="Seleccione el cliente"
            value={customer}
            options={customers}
            onSelect={(opt) => setCustomer(opt)}
            helperText="Primero elige el cliente"
          />

          {customer && (
            <DropDown
              title="Seleccione la plantilla"
              value={template}
              options={templates}
              onSelect={(opt) => setTemplate(opt)}
              helperText={templates.length ? `Extensión que se procesara: .${expectedExt}` : "No hay plantillas para este cliente"}
            />
          )}

          {/* Dropzone */}
          <div className="rounded-xl border border-dashed border-primary-300 bg-white p-4">
            <label
              htmlFor="fileInput"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`grid h-40 cursor-pointer place-items-center rounded-lg border-2 border-dashed px-4 text-primary-800 transition
                ${isDragging ? "border-primary-600 bg-primary-50" : "border-primary-300"}`}
            >
              {previewUrl ? (
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-lg border border-secondary-200 bg-secondary-50">
                      {/* icono genérico */}
                      <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16h16V8zm0 2.5L17.5 8H14zM8 13h8v2H8zm0 4h8v2H8zm0-8h4v2H8z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-primary-900">{file?.name}</p>
                      <p className="text-xs text-primary-700/70">Extensión esperada: .{expectedExt}</p>
                    </div>
                  </div>
                  <Button severity="secondary" variant="outline" onClick={clearFile}>Quitar</Button>
                </div>
              ) : (
                <div className="text-center text-sm">
                  <p>Arrastra y suelta un archivo aquí, o haz clic para subir</p>
                  <p className="mt-1 text-xs text-primary-700/70">Aceptado: .{expectedExt} • Máx 10MB</p>
                </div>
              )}
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept={acceptAttr}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end">
            <div className="w-40">
              <Button
                severity="primary"
                onClick={handleSubmit}
                disabled={!file || !customer || !template}
              >
                Procesar y descargar
              </Button>
            </div>
          </div>
        </div>
      </article>
    </article>
  );
}
