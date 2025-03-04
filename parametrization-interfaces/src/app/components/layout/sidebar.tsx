"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import Button from "@/app/shared/components/button/button.component";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
    // HOOKS
    const { showLoader, hideLoader } = useLoading();
    const { showToast } = useToast();

    const pathname = usePathname();
    // const [loading, setLoading] = useState(true);

    const authContext = useAuth();
    if (!authContext) {
        return null;
    }

    const { hasPermission, loading } = authContext;

    const handleCloseSession = async () => {
        showLoader();
        try {
            await authContext.logout();
            hideLoader();
        } catch (error) {
            showToast("Error!", "Sesión no cerrada.", 4000);
            hideLoader();
        }
    };

    // Elementos del sidebar con permisos asociados
    const itemsSide = [
        {
            id: 1,
            module: "core",
            title: "Dashboard",
            permission: "dashboard.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h8v8H3zm2 2v4zm8-2h8v8h-8zm2 2v4zM3 13h8v8H3zm2 2v4zm11-2h2v3h3v2h-3v3h-2v-3h-3v-2h3zm-1-8v4h4V5zM5 5v4h4V5zm0 10v4h4v-4z"/></svg>,
            link: "/home/dashboard",
        },
        {
            id: 2,
            module: "core",
            title: "Plantillas",
            permission: "templates.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 0H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 22H4V2h16Z"/><path fill="currentColor" d="M6 4h12v2H6zm0 4h7v2H6zm2 12h8l-4-3zm11-1v-6l-5 3zM6 13v6l4-3zm10-1H8l4 3z"/></svg>,
            link: "/home/template",
        },
        {
            id: 3,
            module: "admin",
            title: "Usuarios",
            permission: "user.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g></svg>,
            link: "/home/admin/users",
        },
        {
            id: 4,
            module: "admin",
            title: "Roles",
            permission: "roles.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"><path strokeLinejoin="round" d="M20 10H6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2.5"/><path d="M10 23h8m-8 8h24"/><circle cx="34" cy="16" r="6" strokeLinejoin="round"/><path strokeLinejoin="round" d="M44 28.419C42.047 24.602 38 22 34 22s-5.993 1.133-8.05 3"/></g></svg>,
            link: "/home/admin/rols",
        },
        {
            id: 5,
            module: "admin",
            title: "Clientes",
            permission: "customers.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10h-6V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2M12 6h8v4h-8ZM4 26V12h24v14Z"/></svg>,
            link: "/home/admin/customers",
        },
        {
            id: 6,
            module: "user",
            title: "Configuración",
            permission: "settings.view",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM12 12"/></svg>,
            link: "/home/settings",
        },
        {
            id: 7,
            module: "core",
            title: "Generar achivo",
            permission: "generate.add",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22c-9 1-8-10 0-9C6 2 23 2 22 10c10-3 10 13 1 12m-12-4l5-4l5 4m-5-4v15"/></svg>,
            link: "/home/upload-file",
        },
    ];
    // Agrupar elementos por módulo
    const groupedItems = itemsSide.reduce((acc, item) => {
        if (hasPermission(item.permission)) {
            acc[item.module] = [...(acc[item.module] || []), item];
        }
        return acc;
    }, {} as Record<string, typeof itemsSide>);

    return (
        <aside className="py-4 min-h-screen h-full min-w-fit flex flex-col justify-between text-secondary-200 bg-primary-950">

            <nav className="flex flex-1 flex-col gap-4 px-2 py-4">
            <div className="flex h-16 items-center gap-2 px-6 py-10">
                <Image src="/logos/3.png" width={40} height={40} alt="Logo" />
                <span className="font-bold">Nono Parametrization</span>
            </div>
                {loading ? <div>Loading...</div> : Object.entries(groupedItems).map(([module, items]) => (
                    <div key={module}>
                        <h3 className="text-sm font-bold text-gray-500">{module.toUpperCase()}</h3>
                        {items.map((item) => (
                            <Link key={item.id} href={item.link}>
                                <Button severity="primary" active={pathname.includes(item.link)} onClick= {() => {}}>
                                    {item.icon}
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="mb-12">
                <Button severity="primary" onClick={handleCloseSession}>Cerrar sesión</Button>
            </div>
        </aside>
    );
}
