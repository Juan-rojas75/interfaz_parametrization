import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Loader from "./components/custom/loader/loader";
import { LoadingProvider } from "./context/loaderContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/custom/toast/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parametrización de interfaces",
  description: "Construye interfaces de usuario de forma dinámica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
         <AuthProvider>
          <LoadingProvider>
            <ToastProvider>
                <Toast />
                <Loader />
              {children}
              </ToastProvider>
            </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
