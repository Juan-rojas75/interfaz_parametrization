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

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const router = useRouter()

  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado
  const [customers, setCustomers] = useState<Option[]>([]);
  const [customer, setCustomer] = useState<Option | undefined>();
  const [extensionSelected, setExtensionSelected] = useState<Option | undefined>();
  const [template, setTemplate] = useState<{ name?: string; extension?: string } | null>(null);
  const [datatemplate, setDataTemplate] = useState<ItemType[]>([]);
  const [selectedFields, setSelectedFields] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Tipos de extensión de documento (opciones estáticas)
  const extension: Option[] = useMemo(
    () => [
      { name: "PDF", value: "pdf" },
      { name: "Excel", value: "xlsx" },
      { name: "CSV", value: "csv" },
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
  
      const formattedData = response
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
          },
        }))
        .sort((a: any, b: any) => a.index - b.index); // Ordena por index de menor a mayor
  
      setDataTemplate(formattedData);
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

  const handleSubmit = async () => {
    // construir data to send
    const data = {
      name: template?.name,
      extension: template?.extension || extensionSelected?.value,
      status: true,
      default: false,
      customer: customer?.value,
      fields: selectedFields,
    };
    console.log(data);
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

            <article className="flex flex-col gap-10 p-8">
              <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
                <h1 className="text-4xl text-left font-bold text-primary-950">Parametrización de interfaces</h1>
              </section>
              <section className="flex flex-col gap-4 justify-between w-full">
                <DropDown
                  title="Seleccione el cliente"
                  value={customer}
                  options={customers}
                  onSelect={(value) => setCustomer(value)}
                />
                <div>
                  <h2 className="text-base font-semibold mb-1">Escribe el nombre</h2>
                  <input
                    type="text"
                    name="name"
                    value={template?.name || ""}
                    className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                    onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <DropDown
                  title="Seleccione la extensión"
                  value={extensionSelected}
                  options={extension}
                  onSelect={(value) => setExtensionSelected(value)}
                />
              </section>

              <DragDropDemo itemsInit={datatemplate} onConfigSave={handleConfigSave} />

              <Button
                disabled={selectedFields.length === 0}
                active={true}
                severity="primary"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </article>
    }
    </div>
    
  );
}
