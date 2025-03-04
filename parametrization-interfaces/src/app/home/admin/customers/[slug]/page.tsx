"use client";
import { useEffect, useState, useMemo, use } from "react";
import { apiGet, apiPatch, apiPost } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import Button from "@/app/shared/components/button/button.component";

// Interfaces
import { Option } from "@/app/shared/components/dropdown/interfaces/OptionItem.interface";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { CustomerInterface } from "@/app/context/interfaces/auth.interface";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const router = useRouter()

  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado
  const [customer, setCustomer] = useState<CustomerInterface>({} as CustomerInterface);
  const [documentTypeSelected, setDocumentTypeSelected] = useState<Option | undefined>();

    // Tipos de extensión de documento (opciones estáticas)
    const documentType: Option[] = useMemo(
        () => [
            { name: "NIT", value: "NIT" },
        ],
        []
    );

  // Obtener datos del template
  async function fetchCustomer_id() {
    showLoader();
    try {
      const response = await apiGet(`/customers/${slug}`);
      if (!response) throw new Error("Error al obtener los datos");
      
      console.log(response);
      setDocumentTypeSelected({ name: response.identitycation_type, value: response.identitycation_type });
      console.log(documentTypeSelected);
      setCustomer(response);
      hideLoader();
      
    } catch (err: any) {
      hideLoader();
    }
  }
  // Llamada inicial (fetch data)
  useEffect(() => {
    if (slug === "crear") {
      
    } else {
        fetchCustomer_id();
    }
  }, [slug]);


  const handleSubmit = async () => {
    // construir data to send
    const data = {
      name: customer?.name,
      identitycation_type: documentTypeSelected?.value,
      identificacion: customer?.identificacion,
      status: customer?.status,
    };
    showLoader();
    try {
      if (slug === "crear") {
      const response = await apiPost(`/customers`, data);
      if (!response){
        showToast("Error!", "Cliente no creado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Cliente creado.", 4000);
        router.push("/home/admin/customers");
      }
      
    } else {
      const response = await apiPatch(`/customers/${slug}`, data);
      if (!response){
        showToast("Error!", "Cliente no actualizado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Cliente actualizado.", 4000);
        router.push("/home/admin/customers");
        }
      }
      hideLoader();
    } catch (err: any) {
      showToast("Error!", "Cliente no actualizado.", 4000);
      hideLoader();
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="w-full">
      {
        ( (customer && documentTypeSelected) || slug === "crear" ) &&

            <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
              <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
                <h1 className="text-4xl text-left font-bold text-primary-950">Cliente</h1>
              </section>
              <section className="flex flex-col gap-4 justify-between w-full">
                <div>
                  <h2 className="text-base font-semibold mb-1">Nombre</h2>
                  <input
                    type="text"
                    name="name"
                    value={customer?.name || ""}
                    className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                    onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <DropDown
                  title="Tipo de documento"
                  value={documentTypeSelected}
                  options={documentType}
                  onSelect={(value) => setDocumentTypeSelected(value)}
                />
                <div>
                    <h2 className="text-base font-semibold mb-1">Número de identifcación</h2>
                    <input
                        type="text"
                        name="name"
                        value={customer?.identificacion || ""}
                        className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        onChange={(e) => setCustomer((prev) => ({ ...prev, identificacion: e.target.value }))}
                    />
                </div>
                <div className="flex items-center gap-5">
                    <h2 className="text-base font-semibold mb-1">Estado</h2>
                    <input
                        type="checkbox"
                        name="status"
                        id="status"
                        className="p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        checked={customer?.status || false} // Asegura que refleje el estado actual
                        onChange={(e) =>
                            setCustomer((prev) => ({ ...prev || {}, status: e.target.checked }))
                        }
                    />
                </div>
              </section>
              <div className="max-w-24">
                <Button
                  disabled={false}
                  active={true}
                  severity="primary"
                  onClick={handleSubmit}
                >
                  Guardar
                </Button>
              </div>
            </article>
    }
    </div>
    
  );
}
