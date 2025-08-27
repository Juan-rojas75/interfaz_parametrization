"use client";
import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

// Validación
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordRules = {
  min: 8,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  num: /\d/,
};

const Schema = z
  .object({
    email: z.string().trim().min(1, "El correo es obligatorio").email("Correo inválido"),
    password: z
      .string()
      .min(passwordRules.min, `Mínimo ${passwordRules.min} caracteres`)
      .regex(passwordRules.upper, "Debe incluir una mayúscula")
      .regex(passwordRules.lower, "Debe incluir una minúscula")
      .regex(passwordRules.num, "Debe incluir un número"),
    confirm: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

type FormValues = z.infer<typeof Schema>;

export function ForgotPasswordForm() {
  const auth = useAuth();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showToast } = useToast();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(Schema), mode: "onBlur" });

  const pwd = watch("password") || "";
  const strength = useMemo(() => {
    let score = 0;
    if (pwd.length >= passwordRules.min) score++;
    if (passwordRules.upper.test(pwd)) score++;
    if (passwordRules.lower.test(pwd)) score++;
    if (passwordRules.num.test(pwd)) score++;
    return score; // 0..4
  }, [pwd]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        showLoader();
        await auth.recovery_pass(values.email, values.password, values.confirm);
        showToast("¡Éxito!", "Recuperación realizada correctamente.", 3000);
        router.push("/auth/login");
      } catch (e) {
        setError("email", { message: "No se pudo completar la recuperación" });
        showToast("Error!", "No se completó la recuperación.", 4000);
      } finally {
        hideLoader();
      }
    },
    [auth, hideLoader, router, setError, showLoader, showToast]
  );

  return (
    <main className="grid min-h-screen grid-cols-1 bg-secondary-200 md:grid-cols-[1.1fr_1fr]">
      {/* Lado ilustración */}
      <section className="relative hidden items-center justify-center p-10 md:flex">
        <div className="relative z-10 max-w-md">
          <Image src="/logos/nono-4.png" width={80} height={80} alt="Logo" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary-950">¿Olvidaste tu contraseña?</h1>
          <p className="mt-2 text-base text-primary-900/80">Reestablece tu acceso usando tu correo.</p>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-20 [background:radial-gradient(600px_200px_at_20%_20%,#a5b4fc,transparent_60%),radial-gradient(600px_200px_at_80%_80%,#fde68a,transparent_60%)]" />
      </section>

      {/* Formulario */}
      <section className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full max-w-md rounded-2xl border border-secondary-300 bg-primary-950/95 p-6 text-secondary-50 shadow-xl backdrop-blur"
        >
          <div className="mb-6 flex items-center gap-3">
            <Image src="/logos/3.png" width={48} height={48} alt="Logo" className="md:hidden" />
            <div>
              <h2 className="text-xl font-bold">Recuperar contraseña</h2>
              <p className="text-xs text-secondary-200/70">Te enviaremos los pasos a tu correo.</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              {...register("email")}
              className={`w-full rounded-lg border bg-white p-2 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-400 focus:ring-red-400" : "border-secondary-400 focus:ring-primary-500"
              }`}
              placeholder="nombre@empresa.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Nueva contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
                className={`w-full rounded-lg border bg-white p-2 pr-10 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-400 focus:ring-red-400" : "border-secondary-400 focus:ring-primary-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-2 text-primary-800/70 hover:bg-primary-100"
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2.1 4.93L3.5 3.51L20.49 20.5L19.07 21.9L15.75 18.58C14.58 18.85 13.33 19 12 19C6.5 19 2 15 1 12C1.3 11.19 2.35 9 4.5 7.25L2.1 4.93M12 7A5 5 0 0 1 17 12C17 12.7 16.85 13.36 16.59 13.96L13.04 10.41C13.64 10.15 14.3 10 15 10A3 3 0 0 0 12 7M12 5C17.5 5 22 9 23 12C22.73 12.75 21.86 14.5 20 16L18.59 14.59C19.6 13.67 20.35 12.62 20.7 12C19.7 10 15.5 7 12 7C11.67 7 11.34 7.03 11.02 7.08L9.4 5.46C10.22 5.23 11.09 5.09 12 5Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c5.5 0 10 4 11 7c-.27.75-1.14 2.5-3 4c-1.77 1.4-4.5 3-8 3c-5.5 0-10-4-11-7c.3-.81 1.35-3 3.5-4.75C6.1 6.06 9.09 5 12 5m0 2a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5Z"/></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}

            {/* Indicador de fuerza */}
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-secondary-200/80">
                <span>Fortaleza</span>
                <span>{["Muy débil", "Débil", "Media", "Buena", "Fuerte"][strength]}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 rounded ${i < strength ? "bg-secondary-300" : "bg-secondary-300/30"}`} />
                ))}
              </div>
              <ul className="mt-2 grid list-disc gap-1 pl-4 text-[11px] text-secondary-200/80">
                <li>Mínimo {passwordRules.min} caracteres</li>
                <li>Al menos una mayúscula y una minúscula</li>
                <li>Al menos un número</li>
              </ul>
            </div>
          </div>

          {/* Confirm */}
          <div className="mb-6">
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.confirm}
                {...register("confirm")}
                className={`w-full rounded-lg border bg-white p-2 pr-10 text-sm text-primary-950 placeholder:text-primary-800/50 focus:outline-none focus:ring-2 ${
                  errors.confirm ? "border-red-400 focus:ring-red-400" : "border-secondary-400 focus:ring-primary-500"
                }`}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-2 text-primary-800/70 hover:bg-primary-100"
                aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
              >
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2.1 4.93L3.5 3.51L20.49 20.5L19.07 21.9L15.75 18.58C14.58 18.85 13.33 19 12 19C6.5 19 2 15 1 12C1.3 11.19 2.35 9 4.5 7.25L2.1 4.93M12 7A5 5 0 0 1 17 12C17 12.7 16.85 13.36 16.59 13.96L13.04 10.41C13.64 10.15 14.3 10 15 10A3 3 0 0 0 12 7M12 5C17.5 5 22 9 23 12C22.73 12.75 21.86 14.5 20 16L18.59 14.59C19.6 13.67 20.35 12.62 20.7 12C19.7 10 15.5 7 12 7C11.67 7 11.34 7.03 11.02 7.08L9.4 5.46C10.22 5.23 11.09 5.09 12 5Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c5.5 0 10 4 11 7c-.27.75-1.14 2.5-3 4c-1.77 1.4-4.5 3-8 3c-5.5 0-10-4-11-7c.3-.81 1.35-3 3.5-4.75C6.1 6.06 9.09 5 12 5m0 2a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5Z"/></svg>
                )}
              </button>
            </div>
            {errors.confirm && <p className="mt-1 text-xs text-red-300">{errors.confirm.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-300 px-4 py-2 font-semibold text-primary-950 transition hover:bg-secondary-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
              </svg>
            )}
            Continuar
          </button>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-xs text-secondary-300 hover:underline">Volver al inicio de sesión</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
