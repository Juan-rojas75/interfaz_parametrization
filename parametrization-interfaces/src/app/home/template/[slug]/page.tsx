"use client";
import { useEffect, useState, useMemo, use } from "react";
import { apiGet, apiPatch, apiPost } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { DragDropDemo, ItemType } from "./components/DragDrop/drag-drop.component";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import Button from "@/app/shared/components/button/button.component";

// Interfaces
import { Option } from "@/app/shared/components/dropdown/interfaces/OptionItem.interface";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { FirstLineComponent } from "./components/FirstLine/FirstLine.component";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const router = useRouter()

  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado
  const [customers, setCustomers] = useState<Option[]>([]);
  const [customer, setCustomer] = useState<Option | null>();
  const [extensionSelected, setExtensionSelected] = useState<Option | null>();
  const [firstLine, setFirstLine] = useState<Boolean>(false);
  const [template, setTemplate] = useState<{ name?: string; extension?: string, first_line?: boolean } | null>(null);
  const [datatemplate, setDataTemplate] = useState<ItemType[]>([]);
  const [datatemplateFirstLine, setDataTemplateFirstLine] = useState<ItemType[]>([]);
  const [selectedFields, setSelectedFields] = useState<any[]>([]);
  const [selectedFieldsFirstLine, setSelectedFieldsFirstLine] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Tipos de extensión de documento (opciones estáticas)
  const extension: Option[] = useMemo(
    () => [
      { name: "Excel", value: "xlsx" },
      { name: "TXT", value: "txt" },
    ],
    []
  );

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
      setError(err.message);
    }
  }

  // Obtener datos del template
  async function fetchTemplates() {
    showLoader();
    try {
      const response = await apiGet(`/templates/${slug}`);
      if (!response) throw new Error("Error al obtener los datos");
      
      const customerData = { name: response.customer.name, value: response.customer._id };
      // Cargar columnas del template
      await fetchDataTemplates();
      setTemplate(response);
      setFirstLine(response.first_line ?? false);
      setCustomer(customerData);
      setCustomers([customerData]);
      setExtensionSelected({ name: response.extension, value: response.extension });
      hideLoader();
      
    } catch (err: any) {
      hideLoader();
      setError(err.message);
    }
  }

  // Obtener columnas del template
  async function fetchDataTemplates() {
    try {
      const response = await apiGet(`/data-template/template/${slug}`);
      if (!response) throw new Error("Error al obtener los datos");
  
      const formattedData = response.filter((item:any) => !item.first_line )
        .map((item: any) => ({
          ...item,
          id: item.id,
          index: item.index,
          container: "file-structure",
          valuesDefault: item.value_default,
          config: {
            name: item.name,
            link_name: item.link_name,
            default: item.default,
            valuesDefault: item.value_default,
            transformation: item.valuesTransform,
            size: item.length,
            type: item.type,
            format_date: item.format_date,
            completed: item.complete_with,
            align: item.align,
            first_line: item.first_line,
          },
        }))
        .sort((a: any, b: any) => a.index - b.index); // Ordena por index de menor a mayor
  
      setDataTemplate(formattedData);
      const formattedDataFirstLine = response.filter((item:any) => item.first_line === true )
        .map((item: any) => ({
          ...item,
          id: item.id,
          index: item.index,
          container: "file-structure",
          valuesDefault: item.value_default,
          config: {
            name: item.name,
            link_name: item.link_name,
            default: item.default,
            valuesDefault: item.value_default,
            transformation: item.valuesTransform,
            size: item.length,
            type: item.type,
            format_date: item.format_date,
            completed: item.complete_with,
            type_calcule: item.type_calcule,
            align: item.align,
            first_line: item.first_line,
          },
        }))
        .sort((a: any, b: any) => a.index - b.index); // Ordena por index de menor a mayor
  
      setDataTemplateFirstLine(formattedDataFirstLine);
    } catch (err: any) {
      setError(err.message);
    }
  }
  

  // Llamada inicial (fetch data)
  useEffect(() => {
    if (slug === "crear") {
      fetchCustomers();
    } else {
      fetchTemplates();
    }
  }, [slug]);

  // Guardar campos seleccionados
  const handleConfigSave = (fields: ItemType[]) => {
    setSelectedFields(fields);
  };
  
  // Guardar campos seleccionados
  const handleConfigSaveFirstLinea = (fields: ItemType[]) => {
    setSelectedFieldsFirstLine(fields);
  };

  const handleSubmit = async () => {
    // construir data to send
    const firstLinetest = [
      ...selectedFieldsFirstLine,
      ...selectedFields
    ];
    const data = {
      name: template?.name,
      extension: template?.extension || extensionSelected?.value,
      status: true,
      default: false,
      first_line: firstLine,
      customer: customer?.value,
      fields: firstLinetest,
    };
    showLoader();
    try {
      if (slug === "crear") {
      const response = await apiPost(`/templates`, data);
      if (!response){
        showToast("Error!", "Plantilla no creada.", 4000);
      }
      else{
        showToast("¡Éxito!", "Plantilla creada.", 4000);
        router.push("/home/template");
      }
      
    } else {
      const response = await apiPatch(`/templates/${slug}`, data);
      if (!response){
        showToast("Error!", "Plantilla no actualizada.", 4000);
      }
      else{
        showToast("¡Éxito!", "Plantilla actualizada.", 4000);
        router.push("/home/template");
        }
      }
      hideLoader();
    } catch (err: any) {
      setError(err.message);
      showToast("Error!", "Plantilla no actualizada.", 4000);
      hideLoader();
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="w-full">
      {
  ( (template && customer && datatemplate) || slug === "crear" ) &&

      <article className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 sm:p-8">
        <section className="relative overflow-hidden rounded-2xl border border-secondary-200 bg-gradient-to-br from-secondary-100 to-secondary-200 p-6 sm:p-8">
          <div className="flex flex-col gap-3">
          <nav className="text-xs sm:text-sm text-primary-700/80" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
          <li className="hover:underline cursor-default">Plantillas</li>
          <li>•</li>
          <li className="font-medium text-primary-900">Parametrización de interfaces</li>
          </ol>
          </nav>
          <h1 className="text-left text-3xl sm:text-4xl font-bold text-primary-950 tracking-tight">Parametrización de interfaces</h1>
          <p className="max-w-2xl text-sm text-primary-800/80">Define el cliente, asigna nombre y estructura el contenido del archivo. Los cambios se guardarán al confirmar.</p>
          </div>
        </section>
      
        <section className="grid gap-6 rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-primary-950">Datos básicos</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
                <DropDown
                  title="Seleccione el cliente"
                  value={customer}
                  options={customers}
                  onSelect={(value) => setCustomer(value)}
                />
                <p className="text-xs text-primary-700/70">Este cliente determinará reglas y campos disponibles.</p>
            </div>
          </div>
         <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-primary-900">Nombre de la plantilla</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Ej. Integración BBVA – Nómina"
              value={template?.name || ""}
              className="w-full max-w-xl rounded-lg border border-secondary-200 bg-white p-2 text-sm text-primary-950 placeholder:text-primary-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onChange={(e) => setTemplate((prev: any) => ({ ...prev, name: e.target.value }))}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary-700/70">Usa un nombre claro y único.</p>
                <span className="text-xs text-primary-700/60">{(template?.name?.length ?? 0)}/80</span>
              </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <DropDown
                title="Seleccione la extensión"
                value={extensionSelected}
                options={extension}
                onSelect={(value) => setExtensionSelected(value)}
              />

            </div>
          </div>
          
            {extensionSelected?.value === "txt" && (
              <div className="flex items-center gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-3">
                <label htmlFor="FirstLine" className="text-sm font-medium text-primary-900">¿Archivo con primera línea?</label>
                <input
                id="FirstLine"
                type="checkbox"
                checked={!!firstLine}
                onChange={(e) => setFirstLine(e.target.checked)}
                className="h-4 w-4 rounded-md border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            )}
        </section>

        {/* Config primera línea */}
          {extensionSelected?.value === "txt" && firstLine && (
            <section className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
            <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-primary-950">Primera línea</h3>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-primary-800">Opcional</span>
            </div>
            {FirstLineComponent ? (
            <FirstLineComponent itemsInit={datatemplateFirstLine} onConfigSave={handleConfigSaveFirstLinea} />
            ) : (
            <p className="text-sm text-primary-800/80">(Componente <code>FirstLineComponent</code> no provisto)</p>
            )}
            </section>
          )}

        {/* Cuerpo del template */}
        <section className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-primary-950">Cuerpo del template</h3>
            <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs text-primary-800">Arrastra y suelta</span>
          </div>
            {DragDropDemo ? (
            <DragDropDemo itemsInit={datatemplate} onConfigSave={handleConfigSave} />
            ) : (
            <p className="text-sm text-primary-800/80">(Componente <code>DragDropDemo</code> no provisto)</p>
            )}
        </section>

        {/* Barra de acciones */}
        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 border-t border-secondary-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <div className="text-xs text-primary-800/70">
            {selectedFields.length === 0 ? (
            <span>Selecciona campos para habilitar el guardado.</span>
            ) : (
            <span>{selectedFields.length} campo{selectedFields.length>1?'s':''} seleccionado{selectedFields.length>1?'s':''}</span>
            )}
            </div>
          {Button ? (
          <Button
          disabled={selectedFields.length === 0}
          active={true}
          severity="primary"
          onClick={handleSubmit}
          >
          Guardar
          </Button>
          ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedFields.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-primary-500 bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:border-secondary-300 disabled:bg-secondary-200 disabled:text-secondary-600"
            >
            Guardar
          </button>
          )}
          </div>
        </div>
      </article>
    }
    </div>
    
  );
}
