"use client";
import { Table } from "@/app/components/custom/table/table"
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { apiDelete, apiGet } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Templates() {

  const router = useRouter()
  //HOOKS
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();
  
  const [data, setData] = useState([]); 
  const [paginator, setPaginator] = useState({total: 0, page: 1, pages: 0, items_per_page: 0}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const columns = [{field: "customer" ,name:"Cliente",id:5},{field: "name" ,name:"Titulo",id:1}, {field: "extension" ,name:"Extension",id:2}, {field: "status" ,name:"Estado",id:3}, {field: "default" ,name:"Predeterminado",id:4}];

  const actions ={add: true, edit: true, delete: true};

  async function fetchTemplates(page = 1, limit = 20) {
    showLoader();
    try {
      const response = await apiGet(`/templates?page=${page}&limit=${limit}`); // Ajusta la URL según tu API
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
    fetchTemplates();
  }, []);

  async function handleAddClick() {
    showLoader();
    router.push(`/home/template/crear`);
    hideLoader();
  }
  
  async function handleEditClick(item: any) {
    showLoader();
    router.push(`/home/template/${item.id}`);
    hideLoader();
  }

  async function handleDeleteClick(item: any) {
    showLoader();
    const response = await apiDelete(`/templates/${item.id}`);
    if (!response) {
      showToast("Error!", "Plantilla no eliminada.", 4000);
    }
    else{
      showToast("¡Éxito!", "Plantilla eliminada.", 4000);
      fetchTemplates();
    }
    hideLoader();
  }
  
  async function handlePageClick(page: number) {
    fetchTemplates(page);
  }

  return (
    <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
      <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
        <h1 className="text-4xl text-left font-bold text-primary-950">Plantillas</h1>
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
