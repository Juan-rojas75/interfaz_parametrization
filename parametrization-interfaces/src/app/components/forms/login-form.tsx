"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

export function SigninForm() {
  // --- Hooks siempre al tope ---
  const auth = useAuth();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  // Estado UI
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Si el contexto no está disponible, render amable (no setState en render)
  if (!auth) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary-200 p-6 text-center">
        <div className="max-w-md rounded-2xl border border-secondary-300 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">No se pudo iniciar el módulo de autenticación.</p>
          <p className="mt-1 text-xs text-primary-800/80">Intenta recargar la página.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string | null)?.trim();
    const password = (formData.get("password") as string | null)?.trim();

    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      showToast("Error!", "Por favor completa todos los campos.", 4000);
      return;
    }

    try {
      setSubmitting(true);
      showLoader();
      await auth.login(email, password);
      showToast("¡Éxito!", "Autenticación realizada correctamente.", 3000);
      router.replace("/home/dashboard");
    } catch (err) {
      setErrorMessage("Credenciales incorrectas");
      showToast("Error!", "Credenciales incorrectas.", 4000);
    } finally {
      hideLoader();
      setSubmitting(false);
    }
  }, [auth, hideLoader, router, showLoader, showToast]);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-secondary-200 md:grid-cols-[1.1fr_1fr]">
      {/* Panel info / branding */}
      <section className="relative hidden items-center justify-center p-10 md:flex">
        <div className="relative z-10 max-w-md">
          <Image src="/logos/nono-4.png" width={80} height={80} alt="Logo" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary-950">Bienvenido de nuevo</h1>
          <p className="mt-2 text-base text-primary-900/80">
            Inicia sesión para continuar y acceder a tus recursos.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-20 [background:radial-gradient(600px_200px_at_20%_20%,#a5b4fc,transparent_60%),radial-gradient(600px_200px_at_80%_80%,#fde68a,transparent_60%)]" />
      </section>

      {/* Panel formulario */}
      <section className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-secondary-300 bg-primary-950/95 p-6 text-secondary-50 shadow-xl backdrop-blur"
          noValidate
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logos/nono-3.png" width={48} height={48} alt="Logo" className="md:hidden" />
              <h2 className="text-xl font-bold">Ingresar</h2>
            </div>
          </div>

          {/* Banner de error */}
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50/90 p-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              className="w-full rounded-lg border border-secondary-400 bg-white p-2 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="nombre@empresa.com"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-secondary-400 bg-white p-2 pr-10 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-2 text-primary-800/70 hover:bg-primary-100"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2.1 4.93L3.5 3.51L20.49 20.5L19.07 21.9L15.75 18.58C14.58 18.85 13.33 19 12 19C6.5 19 2 15 1 12C1.3 11.19 2.35 9 4.5 7.25L2.1 4.93M12 7A5 5 0 0 1 17 12C17 12.7 16.85 13.36 16.59 13.96L13.04 10.41C13.64 10.15 14.3 10 15 10A3 3 0 0 0 12 7M12 5C17.5 5 22 9 23 12C22.73 12.75 21.86 14.5 20 16L18.59 14.59C19.6 13.67 20.35 12.62 20.7 12C19.7 10 15.5 7 12 7C11.67 7 11.34 7.03 11.02 7.08L9.4 5.46C10.22 5.23 11.09 5.09 12 5Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c5.5 0 10 4 11 7c-.27.75-1.14 2.5-3 4c-1.77 1.4-4.5 3-8 3c-5.5 0-10-4-11-7c.3-.81 1.35-3 3.5-4.75C6.1 6.06 9.09 5 12 5m0 2a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5Z"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded border-secondary-400 text-primary-600 focus:ring-primary-500" />
              Recordarme
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-secondary-300 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-300 px-4 py-2 font-semibold text-primary-950 transition hover:bg-secondary-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
              </svg>
            )}
            Continuar
          </button>

          {/* Divider y registros */}
          <div className="mt-6 text-center text-xs text-secondary-300">© Nono</div>
        </form>
      </section>
    </main>
  );
}
