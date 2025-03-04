import React from "react";
import { ModalProps } from "./interfaces/modal.interface";
export default function Modal({ children }: Readonly<ModalProps>) {

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        {children}
    </div>
  );
}
