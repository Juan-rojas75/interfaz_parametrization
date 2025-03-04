"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useLoading } from "@/app/context/loaderContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

export function SigninForm() {
    const [errorMessage, setErrorMessage] = useState("");
    //HOOKS
    const { showLoader, hideLoader } = useLoading();
    const { showToast } = useToast();
    const router = useRouter();

    const authContext = useAuth();
    if (!authContext) {
        setErrorMessage("Error: Auth context is not available");
        return null;
    }
  
    const handleSubmit = async (e : any) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      showLoader();
      try {
        if (formData) {
            const email = formData.get("email") as string | null;
            const password = formData.get("password") as string | null;
            if (email && password) {
              await authContext.login(email, password);
              showToast("¡Éxito!", "Autenticación realizada correctamente.", 4000);
            } else {
              setErrorMessage("Por favor, completa todos los campos.");
              showToast("Error!", "Por favor completa todos los campos.", 4000);
            }
            hideLoader();
          }
        } catch (error) {
          setErrorMessage("Credenciales incorrectas");
          showToast("Error!", "Credenciales incorrectas.", 4000);
          hideLoader();
      }
    };

    return (
      <article className="min-h-screen flex items-center justify-center bg-secondary-200">
        <article className="flex flex-row bg-white backdrop-blur-3xl rounded-lg">
          <section className="px-10 py-6 text-left max-w-96 text-primary-950 hidden md:block">
              <Image
                  src="/logos/1.png"
                  width={80}
                  height={80}
                  alt="Logo"
                  className=""
              />
            <div className="flex flex-row gap-2">
              <h1 className="text-2xl font-bold mb-6">
                Bienvenido de nuevo
              </h1>
            </div>
            <p className="text-xl">
              Inicia sesión para continuar y accede a tus recursos.
            </p>
          </section>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 justify-center space-y-4 p-8 h-screen w-screen md:w-96 md:h-full md:min-w-96 md:rounded-r-lg md:rounded-l-3xl shadow-md text-secondary-200 bg-primary-950 opacity-95">
            <Image
              src="/logos/3.png"
              width={80}
              height={80}
              alt="Logo"
              className="block md:hidden flex-col text-center"/>
            <div className="flex flex-row gap-2 justify-between w-full items-center">
              <h2 className="text-2xl font-bold text-left">
                Ingresar
              </h2>
            </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="mb-4">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
                placeholder="Por favor ingresa tu correo electrónico"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
                placeholder="Por favor ingresa tu contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full text-primary-950 py-2 px-4 rounded-md bg-secondary-300 focus:outline-none"
            >
              Continuar
            </button>
            <div className="mt-6 text-center">
              <Link href="/auth/forgot-password" className="text-sm text-secondary-300 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
          </form>
        </article>
      </article>
    );
  }