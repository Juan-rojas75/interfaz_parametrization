"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/app/shared/components/button/button.component";
import { useAuth } from "@/app/context/AuthContext";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";

/**
 * Sidebar con mejoras de UI/UX
 * - Colapsable (persistente en localStorage)
 * - Estados activos/hover claros, accesibilidad (aria, roles)
 * - Encabezado compacto con logo + toggle
 * - Secciones agrupadas por módulo con títulos pegajosos
 * - Soporta loading con skeleton
 * - Botón cerrar sesión con feedback
 */

export function Sidebar() {
  // CONTEXTOS
  const auth = useAuth();
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();
  const pathname = usePathname();

  if (!auth) return null;
  const { hasPermission, loading } = auth;

  // ESTADO: colapsado
  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    const saved = localStorage.getItem("sidebar:collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);
  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      localStorage.setItem("sidebar:collapsed", c ? "0" : "1");
      return !c;
    });
  }, []);

  // DATOS: ítems del menú
  const itemsSide = useMemo(
    () => [
      {
        id: 1,
        module: "core",
        title: "Dashboard",
        permission: "dashboard.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M3 3h8v8H3zm2 2v4zm8-2h8v8h-8zm2 2v4zM3 13h8v8H3zm2 2v4zm11-2h2v3h3v2h-3v3h-2v-3h-3v-2h3zm-1-8v4h4V5zM5 5v4h4V5zm0 10v4h4v-4z"/>
          </svg>
        ),
        link: "/home/dashboard",
      },
      {
        id: 2,
        module: "core",
        title: "Plantillas",
        permission: "templates.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M20 0H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 22H4V2h16Z"/>
            <path fill="currentColor" d="M6 4h12v2H6zm0 4h7v2H6zm2 12h8l-4-3zm11-1v-6l-5 3zM6 13v6l4-3zm10-1H8l4 3z"/>
          </svg>
        ),
        link: "/home/template",
      },
      {
        id: 3,
        module: "admin",
        title: "Usuarios",
        permission: "user.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </g>
          </svg>
        ),
        link: "/home/admin/users",
      },
      {
        id: 4,
        module: "admin",
        title: "Roles",
        permission: "roles.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" aria-hidden>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4">
              <path strokeLinejoin="round" d="M20 10H6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2.5"/>
              <path d="M10 23h8m-8 8h24"/>
              <circle cx="34" cy="16" r="6" strokeLinejoin="round"/>
              <path strokeLinejoin="round" d="M44 28.419C42.047 24.602 38 22 34 22s-5.993 1.133-8.05 3"/>
            </g>
          </svg>
        ),
        link: "/home/admin/rols",
      },
      {
        id: 5,
        module: "admin",
        title: "Clientes",
        permission: "customers.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden>
            <path fill="currentColor" d="M28 10h-6V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2M12 6h8v4h-8ZM4 26V12h24v14Z"/>
          </svg>
        ),
        link: "/home/admin/customers",
      },
      {
        id: 6,
        module: "user",
        title: "Configuración",
        permission: "settings.view",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM12 12"/>
          </svg>
        ),
        link: "/home/settings",
      },
      {
        id: 7,
        module: "core",
        title: "Generar archivo",
        permission: "generate.add",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22c-9 1-8-10 0-9C6 2 23 2 22 10c10-3 10 13 1 12m-12-4l5-4l5 4m-5-4v15"/>
          </svg>
        ),
        link: "/home/upload-file",
      },
    ],
    []
  );

  // Agrupar por módulo y filtrar por permiso
  const grouped = useMemo(() => {
    const acc: Record<string, typeof itemsSide> = {} as any;
    for (const item of itemsSide) {
      if (!hasPermission(item.permission)) continue;
      acc[item.module] = [...(acc[item.module] || []), item];
    }
    return acc;
  }, [itemsSide, hasPermission]);

  // Helpers
  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  const handleCloseSession = useCallback(async () => {
    showLoader();
    try {
      await auth.logout();
    } catch (e) {
      showToast("Error!", "Sesión no cerrada.", 4000);
    } finally {
      hideLoader();
    }
  }, [auth, hideLoader, showLoader, showToast]);

  // Skeleton simple
  const Skeleton = () => (
    <div className="flex flex-col gap-3 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-9 w-full animate-pulse rounded-xl bg-white/10" />
      ))}
    </div>
  );

  return (
    <aside
      className={`group sticky top-0 flex min-h-screen flex-col justify-between bg-primary-950 text-secondary-100 transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
      aria-label="Barra lateral de navegación"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-4">
        <div className="flex items-center gap-2 overflow-hidden px-2">
          <Image src="/logos/nono-2.png" width={36} height={36} alt="Logo" className="rounded" />
          {!collapsed && (
            <span className="truncate font-semibold tracking-tight text-secondary-50">Nono Parametrization</span>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          title={collapsed ? "Expandir" : "Colapsar"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-secondary-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            {collapsed ? (
              <path fill="currentColor" d="M10 6l6 6l-6 6V6z" />
            ) : (
              <path fill="currentColor" d="M14 6l-6 6l6 6V6z" />
            )}
          </svg>
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
        {loading ? (
          <Skeleton />
        ) : (
          Object.entries(grouped).map(([module, items]) => (
            <div key={module} className="px-2">
              {/* Título de sección */}
              <div className={`sticky top-0 z-0 mb-2 ${collapsed ? "px-1" : "px-2"}`}>
                <h3
                  className={`text-[10px] font-semibold uppercase tracking-wider text-secondary-300/70 ${
                    collapsed ? "text-center" : "text-left"
                  }`}
                >
                  {module}
                </h3>
              </div>

              {/* Lista de items */}
              <ul role="menu" className="flex flex-col gap-1">
                {items.map((item) => {
                  const active = isActive(item.link);
                  return (
                    <li key={item.id} role="none">
                      <Link
                        href={item.link}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                        title={collapsed ? item.title : undefined}
                        className={`group/item inline-flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm outline-none transition ${
                          active
                            ? "bg-white/10 text-white shadow-inner"
                            : "text-secondary-200 hover:bg-white/5 hover:text-white focus:bg-white/10"
                        } ${collapsed ? "justify-center" : "justify-start"}`}
                      >
                        <span className={`shrink-0 ${active ? "text-white" : "text-secondary-200"}`}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                        {/* Indicador activo */}
                        {active && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-primary-300/90" aria-hidden />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 py-4">
        <button
          onClick={handleCloseSession}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-secondary-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${
            collapsed ? "px-2" : "px-3"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M16 13v-2H7V8l-5 4l5 4v-3zM20 3h-8v2h8v14h-8v2h8q.825 0 1.413-.588T22 19V5q0-.825-.588-1.412T20 3"/>
          </svg>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        {/* Versión/estado opcional */}
        {!collapsed && (
          <p className="mt-2 truncate text-[10px] text-secondary-300/70">v1.0 · © Nono</p>
        )}
      </div>
    </aside>
  );
}
