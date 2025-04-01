"use client";

import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { apiGet } from "@/app/lib/api";
import Button from "@/app/shared/components/button/button.component";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import { Option } from "@/app/shared/components/dropdown/interfaces/OptionItem.interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadFile() {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // Estado
  const [customers, setCustomers] = useState<Option[]>([]);
  const [customer, setCustomer] = useState<Option | undefined>();
  const [templates, setTemplates] = useState<Option[]>([]);
  const [templatesExtension, setTemplatesExtension] = useState<Option[]>([]);
  const [template, setTemplate] = useState<Option>();
  const [extension, setExtension] = useState<String>("xlsx");

  // 📌 Capturar archivo desde input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 📌 Capturar archivo con Drag & Drop
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  // Obtener clientes
  async function fetchCustomers() {
    showLoader();
    try {
      const response = await apiGet(`/customers?page=1&limit=0`);
      if (!response) throw new Error("Error al obtener los datos");
      const customersData = response.data.map((customer: any) => ({
        name: customer.name,
        value: customer._id,
      }));
      setCustomers(customersData);
      hideLoader();
    } catch (err: any) {
      hideLoader();
    }
  }

    // Obtener datos del template
    async function fetchTemplates() {
      showLoader();
      try {
        const response = await apiGet(`/templates/templates_by_customer/${customer?.value}`);
        if (!response) throw new Error("Error al obtener los datos");
        const templatesData = response.map((template: any) => ({
          name: template.name,
          value: template.id,
        }));
        const templatesDataExtension = response.map((template: any) => ({
          name: template.extension,
          value: template.id,
        }));
        setTemplates(templatesData);
        setTemplatesExtension(templatesDataExtension);
        hideLoader();
        
      } catch (err: any) {
        hideLoader();
      }
    }

  // 📌 Enviar archivo al backend
  async function handleSubmit() {
    if (!file) {
      showToast("Selecciona un archivo antes de continuar.", "warning");
      return;
    }
    if (!customer) {
      showToast("Selecciona un cliente antes de continuar.", "warning");
      return;
    }
    if (!template) {
      showToast("Selecciona una plantilla antes de continuar.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_template", template.value.toString());
    formData.append("id_customer", customer.value.toString());

    try {
      showLoader();

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL_FLASK + "/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir el archivo.");

      // 📥 Recibir archivo procesado y descargarlo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Archivo procesado."+extension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Archivo procesado con éxito. Descargando...", "success");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      showToast("Hubo un error al procesar el archivo.", "error");
    } finally {
      hideLoader();
    }
  }

  // Llamada inicial (fetch data)
  useEffect(() => {
      fetchCustomers();
  }, []);

  // Llamada inicial (fetch data)
  useEffect(() => {
    templatesExtension.map((extension) => {
      if (extension.value === template?.value) {
        setExtension(extension.name)
      }
    })
    setExtension
  }, [template]);

  //Llamada cuando se selecciona el cliente
  useEffect(() => {
    fetchTemplates();
  }, [customer]);

  return (
    <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
      <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
        <h1 className="text-4xl text-left font-bold text-primary-950">
          Generar con archivo Excel
        </h1>
      </section>

      <article className="flex flex-col items-center justify-center h-fit w-full gap-10">
        <DropDown
          title="Seleccione el cliente"
          value={customer}
          options={customers}
          onSelect={(value) => setCustomer(value)}
        />
        { customer && templates.length > 0 &&
          <DropDown
            title="Seleccione la plantlla"
            value={template}
            options={templates}
            onSelect={(value) => setTemplate(value)}
          />
        }
        <div className="flex flex-col items-center justify-center border border-dashed border-primary-800 rounded-lg p-6 w-96">
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-800 rounded-lg text-primary-800"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-32 object-cover" />
            ) : (
              <p className="text-center">
                Arrastra y suelta un archivo aquí o haz clic para subir
              </p>
            )}
          </label>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".xlsx"
            onChange={handleFileChange}
          />
          {file && (
            <p className="mt-2 text-sm text-primary-700 font-bold">
              {file.name}
            </p>
          )}
        </div>

        <section className="flex flex-col items-center justify-center">
          <div className="max-w-24">
            <Button
              disabled={!file}
              active={true}
              severity="primary"
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </div>
        </section>
      </article>
    </article>
  );
}
