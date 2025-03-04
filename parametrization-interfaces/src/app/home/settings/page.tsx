"use client";
import { apiGet } from "@/app/lib/api";
import { formatDate, iosFormat } from "@/app/utils/iosFormat.util";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Settings() {


    const [sessons, setSessions] = useState<any>([]);
    const [user, setUser] = useState<any>();

    const [loading, setLoading] = useState(true);

    async function fetchUserInfo() {
        setLoading(true);
        try {
          const response = await apiGet(`/users/by-token/`); // Ajusta la URL según tu API
          if (!response) throw new Error("Error al obtener los datos");
          const result = response;
          setUser(result); // Guardar los datos en el estado
        } catch (err: any) {
          console.error(err);
        } finally {
          setLoading(false);
        }
    }

    async function fetchSessionInfo() {
        setLoading(true);
        try {
          const response = await apiGet(`/sessions/session_user`); // Ajusta la URL según tu API
          if (!response) throw new Error("Error al obtener los datos");
          const result = response;
          setSessions(result); // Guardar los datos en el estado
        } catch (err: any) {
          console.error(err);
        } finally {
          setLoading(false);
        }
    }
      useEffect(() => {
        fetchUserInfo();
        fetchSessionInfo();
      }, []);

    return (
        <article className="flex flex-col min-h-screen w-full gap-10 h-full p-8">
          <section className="flex flex-col h-fit w-full gap-4 p-8 bg-secondary-200">
            <h1 className="text-4xl text-left font-bold text-primary-950">Configuración</h1>
          </section>
           <article className="flex flex-col items-start justify-start h-fit w-full gap-10">
            {(() => {
              if (loading) {
                return <p className="text-primary-950">Cargando...</p>;
              } else {
                return (
                    <>
                        {
                            user && (
                                <div className="flex flex-col items-start justify-start h-fit w-full gap-10">
                            <section className="flex flex-col h-fit w-full gap-4 p-8">
                                <h1 className="text-4xl text-left font-bold text-primary-950">Información del usuario</h1>
                                <div className="flex flex-row justify-between rounded-md gap-4 w-full h-fit p-8 bg-primary-950 text-secondary-200">
                                    <div className="flex flex-col gap-4 justify-between">
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Username:</label>
                                            <span className="text-lg">{user.username}</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Correo:</label>
                                            <span className="text-lg">{user.email}</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Estado:</label>
                                            <span className="text-lg">{user.status === "active" ? "✔️ Activo" : "❌ Inactivo" }</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <label htmlFor="Rol" className="text-xl font-bold">Rol:</label>
                                            <span className="text-lg">{user.rol.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h1 className="text-xl font-bold">Información del cliente</h1>
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Nombre del cliente:</label>
                                            <span className="text-lg">{user.customer.name}</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Tipo de identificación del cliente:</label>
                                            <span className="text-lg">{user.customer.identitycation_type}</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <label className="text-xl font-bold">Estado del cliente:</label>
                                            <span className="text-lg">{user.customer.status === "active" ? "✔️ Activo" : "❌ Inactivo" }</span>
                                        </div>
                                    </div>
                                </div>
                                <section className="flex flex-col justify-between rounded-md gap-4 w-full h-fit p-8 bg-primary-950 text-secondary-200">
                                    <div className="flex flex-row gap-4">
                                        <label htmlFor="token" className="text-xl font-bold">Token de acceso:</label>
                                        <span className="text-lg">{user.access_token}</span>
                                    </div>
                                    <div className="flex flex-row gap-4">
                                        <label htmlFor="token" className="text-xl font-bold">Fecha de registro:</label>
                                        <span className="text-lg">{formatDate(user.createdAt)}</span>
                                    </div>
                                </section>
                                <section className="flex flex-col justify-between rounded-md gap-4 w-full h-fit p-8 bg-secondary-200">
                                    <h1 className="text-4xl text-left font-bold text-primary-950">Información de sesiones</h1>
                                    <div className="flex flex-row flex-wrap gap-4 justify-stretch">
                                        {sessons.map((session:any) => (
                                        <div key={session.id} className="flex flex-col justify-center rounded-md gap-4 w-96 h-fit p-8 bg-white text-primary-950 hover:text-secondary-200 hover:bg-primary-950">
                                            <div className="flex flex-row justify-between">
                                                <h1 className="text-xl font-bold">{session.ip}</h1>
                                            </div>
                                            <span>{formatDate(session.createdAt)}</span>
                                            <p className="text-2xl font-bold">{iosFormat(session.userAgent)}</p>
                                            <span>{session.revokedAt ? "❌ Revocada" : "✔️ Activa"}</span>
                                        </div>
                                        ))}
                                </div>
                                </section>
                            </section>
                            
                        </div>
                            )
                        }
                    </>
                );
              }
            })()}
          </article>
        </article>
      );
}