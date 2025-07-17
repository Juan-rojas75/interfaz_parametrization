import React from "react";
import { ModalProps } from "./interfaces/modal.interface";
export default function Modal({ children }: Readonly<ModalProps>) {
  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <article className="bg-white max-h-screen overflow-y-auto rounded-lg p-6 w-full max-w-2xl">
        {children}
      </article>
    </section>
  );
}
