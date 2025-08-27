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
import { RoleInterface, UserInterface } from "@/app/context/interfaces/auth.interface";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const router = useRouter()

  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado
  const [user, setUser] = useState<UserInterface>({} as UserInterface);

  //roles
  const [roles, setRoles] = useState<Option[]>([]);
  const [rolSelected, setRolSelected] = useState<Option | null>();

  //Cliente
  const [customer, setCustomer] = useState<Option[]>([]);
  const [customerSelected, setCustomerSelected] = useState<Option | null>();

  // Obtener datos del template
  async function fetchUser_id() {
    showLoader();
    try {
      const response = await apiGet(`/users/${slug}`);
      if (!response) throw new Error("Error al obtener los datos");

      if (response.rol) setRolSelected({ name: response.rol.name, value: response.rol._id });
      if (response.customer) setCustomerSelected({ name: response.customer.name, value: response.customer._id });

      setUser(response);
      hideLoader();
      
    } catch (err: any) {
      hideLoader();
    }
  }

    ///Obtener roles   
  async function fetchRoles(page = 1, limit = 0) {
    showLoader();
    try {
      const response = await apiGet(`/roles?page=${page}&limit=${limit}`); // Ajusta la URL según tu API
      if (!response.meta.status) throw new Error("Error al obtener los datos");
      const rolesData = response.data.map((rol: any) => ({
        name: rol.name,
        value: rol._id,
      }));
      setRoles(rolesData);
      hideLoader();
    } catch (err: any) {
      hideLoader();
    } finally {
      hideLoader();
    }
  }

  ///Obtener clientes   
  async function fetchCustomers(page = 1, limit = 0) {
    showLoader();
    try {
      const response = await apiGet(`/customers?page=${page}&limit=${limit}`); // Ajusta la URL según tu API
      if (!response.meta.status) throw new Error("Error al obtener los datos");
      const customersData = response.data.map((customer: any) => ({
        name: customer.name,
        value: customer._id,
      }));
      setCustomer(customersData);
      hideLoader();
    } catch (err: any) {
      hideLoader();
    } finally {
      hideLoader();
    }
  }

  // Llamada inicial (fetch data)
  useEffect(() => {
    fetchRoles();
    fetchCustomers();
    if (slug === "crear") {
      
    } else {
        fetchUser_id();
    }
  }, [slug]);


  const handleSubmit = async () => {
    // construir data to send
    const data = {
      username: user?.username,
      email: user?.email,
      password: user?.password,
      status: user?.status,
      rol: rolSelected?.value,
      customer: customerSelected?.value,
      avatar: "Avatar.png",
    };
    showLoader();
    try {
      if (slug === "crear") {
      const response = await apiPost(`/users`, data);
      if (!response){
        showToast("Error!", "Usuario no creado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Usuario creado.", 4000);
        router.push("/home/admin/users");
      }
      
    } else {
      const response = await apiPatch(`/users/${slug}`, data);
      if (!response){
        showToast("Error!", "Usuario no actualizado.", 4000);
      }
      else{
        showToast("¡Éxito!", "Usuario actualizado.", 4000);
        router.push("/home/admin/users");
        }
      }
      hideLoader();
    } catch (err: any) {
      showToast("Error!", "Usuario no actualizado.", 4000);
      hideLoader();
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="w-full">
      {
        ( (user && rolSelected ) || slug === "crear" ) &&

            <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
              <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
                <h1 className="text-4xl text-left font-bold text-primary-950">Usuario</h1>
              </section>
              <section className="flex flex-col gap-4 justify-between w-full">
                <div>
                  <h2 className="text-base font-semibold mb-1">Nombre</h2>
                  <input
                    type="text"
                    name="name"
                    value={user?.username || ""}
                    className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                    onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                    <h2 className="text-base font-semibold mb-1">Correo electrónico</h2>
                    <input
                        type="email"
                        name="email"
                        value={user?.email || ""}
                        className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </div>
                {
                    (slug === "crear") &&
                    (

                        <div>
                            <h2 className="text-base font-semibold mb-1">Contraseña</h2>
                            <input
                                type="text"
                                name="password"
                                value={user?.password || ""}
                                className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                                onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                            />
                        </div>
                    )
                }
                <DropDown
                  title="Cliente del usuario"
                  value={customerSelected}
                  options={customer}
                  onSelect={(value) => setCustomerSelected(value)}
                />

                <DropDown
                  title="Rol del usuario"
                  value={rolSelected}
                  options={roles}
                  onSelect={(value) => setRolSelected(value)}
                />
                
                <div className="flex items-center gap-5">
                    <h2 className="text-base font-semibold mb-1">Estado</h2>
                    <input
                        type="checkbox"
                        name="status"
                        id="status"
                        className="p-2 text-sm text-primary-950 border border-secondary-200 rounded-md max-w-screen-sm focus:outline-none"
                        checked={user?.status || false} // Asegura que refleje el estado actual
                        onChange={(e) =>
                            setUser((prev) => ({ ...prev || {}, status: e.target.checked }))
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
