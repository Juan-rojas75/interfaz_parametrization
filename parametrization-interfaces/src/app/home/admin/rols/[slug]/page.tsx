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
import { RoleInterface } from "@/app/context/interfaces/auth.interface";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const router = useRouter()

  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado
  const [rol, setRol] = useState<RoleInterface>({} as RoleInterface);
  const [permissions, setPermissions] = useState<string[]>([]);

  // Obtener datos del template
  async function fetchRoles_id() {
    showLoader();
    try {
      const response = await apiGet(`/roles/${slug}`);
      if (!response) throw new Error("Error al obtener los datos");

      setRol(response);
      setPermissions(response.permissons);
      hideLoader();
      
    } catch (err: any) {
      hideLoader();
    }
  }

  // Llamada inicial (fetch data)
  useEffect(() => {
    if (slug === "crear") {
      
    } else {
        fetchRoles_id();
    }
  }, [slug]);

  //ROLES
  const [newValueName, setNewValueName] = useState('');

  const handleAddPermission = () => {
    if (newValueName.trim()) {
      setPermissions((prev) => [
        ...prev,
        newValueName,
      ]);
      setNewValueName('');
    }
  };

  const handleRemovePermission = (index: number) => {
    setPermissions((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    // construir data to send
    const data = {
      name: rol?.name,
      description: rol?.description,
      status: rol?.status,
      isAdmin: rol?.isAdmin,
      permissons: permissions
    };
    showLoader();
    try {
      if (slug === "crear") {
      const response = await apiPost(`/roles`, data);
      if (!response){
        showToast("Error!", "Rol no creado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Rol creado.", 4000);
        router.push("/home/admin/rols");
      }
      
    } else {
      const response = await apiPatch(`/roles/${slug}`, data);
      if (!response){
        showToast("Error!", "Rol no actualizado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Rol actualizado.", 4000);
        router.push("/home/admin/rols");
        }
      }
      hideLoader();
    } catch (err: any) {
      showToast("Error!", "Rol no actualizado.", 4000);
      hideLoader();
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="w-full">
      {
        ( (rol ) || slug === "crear" ) &&

            <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
              <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
                <h1 className="text-4xl text-left font-bold text-primary-950">Roles</h1>
              </section>
              <section className="flex flex-col gap-4 justify-between w-full">
                <div>
                  <h2 className="text-base font-semibold mb-1">Nombre</h2>
                  <input
                    type="text"
                    name="name"
                    value={rol?.name || ""}
                    className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                    onChange={(e) => setRol((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                    <h2 className="text-base font-semibold mb-1">Descripción</h2>
                    <input
                        type="text"
                        name="description"
                        value={rol?.description || ""}
                        className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        onChange={(e) => setRol((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>
                
                <div className="flex items-center gap-5">
                    <h2 className="text-base font-semibold mb-1">Estado</h2>
                    <input
                        type="checkbox"
                        name="status"
                        id="status"
                        className="p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        checked={rol?.status || false} // Asegura que refleje el estado actual
                        onChange={(e) =>
                            setRol((prev) => ({ ...prev || {}, status: e.target.checked }))
                        }
                    />
                </div>
                <div className="flex items-center gap-5">
                    <h2 className="text-base font-semibold mb-1">Es admin</h2>
                    <input
                        type="checkbox"
                        name="iadmin"
                        id="iadmin"
                        className="p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        checked={rol?.isAdmin || false} // Asegura que refleje el estado actual
                        onChange={(e) =>
                            setRol((prev) => ({ ...prev || {}, isAdmin: e.target.checked }))
                        }
                    />
                </div>
                <div className="mb-4">
                  <h2 className="text-base font-semibold mb-1">Permisos</h2>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="default-values"
                        type="text"
                        value={newValueName}
                        onChange={(e) => setNewValueName(e.target.value)}
                        className="w-full p-2 text-sm text-primary-950 border border-primary-200 rounded-md max-w-screen-sm focus:outline-none"
                      />
                      <div className="flex max-w-fit">
                      <Button severity="secondary" onClick={handleAddPermission} active={true} > Añadir</Button>
                      </div>
                    </div>
        
                    <ul className="mt-2 space-y-1">
                      {permissions.map((value, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-start gap-8 rounded-md bg-gray-100 p-2 text-sm"
                        >
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleRemovePermission(index)}
                          >
                            Eliminar
                          </button>
                          {value}
                        </li>
                      ))}
                    </ul>
                  </div>
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
