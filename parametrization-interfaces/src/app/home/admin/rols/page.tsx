"use client";
import { Table } from "@/app/components/custom/table/table"
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { apiDelete, apiGet } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Rols() {

  const router = useRouter()
  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();
  
  const [data, setData] = useState([]); 
  const [paginator, setPaginator] = useState({total: 0, page: 1, pages: 0, items_per_page: 0}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const columns = [{field: "name" ,name:"Nombre",id:5},{field: "description" ,name:"Descripcion",id:1}, {field: "status" ,name:"Estado",id:2}, {field: "isAdmin" ,name:"Es admin",id:3}, {field: "permissons" ,name:"Permisos",id:4}];

  const actions ={add: true, edit: true, delete: true};

  async function fetchRoles(page = 1, limit = 20) {
    showLoader();
    try {
      const response = await apiGet(`/roles?page=${page}&limit=${limit}`); // Ajusta la URL según tu API
      if (!response.meta.status) throw new Error("Error al obtener los datos");
      const result = response;
      setPaginator(result.meta.paginator);
      setData(result.data);
      hideLoader();
    } catch (err: any) {
      setError(err.message);
      hideLoader();
    } finally {
      setLoading(false);
      hideLoader();
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  async function handleAddClick() {
    showLoader();
    router.push(`/home/admin/rols/crear`);
    hideLoader();
  }
  
  async function handleEditClick(item: any) {
    showLoader();
    router.push(`/home/admin/rols/${item.id || item._id}`);
    hideLoader();
  }

  async function handleDeleteClick(item: any) {
    showLoader();
    const response = await apiDelete(`/roles/${item.id || item._id}`);
    if (!response) {
      showToast("Error!", "Rol no eliminado.", 4000);
    }
    else{
      showToast("¡Éxito!", "Rol eliminado.", 4000);
      fetchRoles();
    }
    hideLoader();
  }
  
  async function handlePageClick(page: number) {
    fetchRoles(page);
  }

  return (
    <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
      <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
        <h1 className="text-4xl text-left font-bold text-primary-950">Roles</h1>
      </section>
       <article className="flex flex-col items-center justify-center h-fit w-full gap-10">
        {(() => {
          if (loading) {
            return <p className="text-primary-950">Cargando...</p>;
          } else if (error) {
            return <p className="text-red-500">Error: {error}</p>;
          } else {
            return (
              <Table 
                columns={columns} 
                data={data} 
                actions={actions} 
                paginator={paginator}
                addClick={handleAddClick} 
                editClick={handleEditClick} 
                deleteClick={handleDeleteClick} 
                pageClick={handlePageClick} 
              />
            );
          }
        })()}
      </article>
    </article>
  );
}
