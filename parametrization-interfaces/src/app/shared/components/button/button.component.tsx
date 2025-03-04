
import React from "react";
import { ButtonProps } from "./interfaces/button.interface";

export default function Button({ onClick, severity, children, disabled, active = false }: Readonly<ButtonProps>) {
  // Determina las clases según la severidad
  let severityClasses = "";

  switch (severity) {
    case "primary":
      severityClasses = `text-secondary-200 w-full hover:bg-primary-900/90 border-primary-300 ${active ? 'bg-primary-900/90' : ''}`;
      break;
    case "secondary":
      severityClasses = "bg-secondary-200 hover:bg-secondary-300 text-primary-950  ";
      break;
    case "danger":
      severityClasses = "bg-red-500 hover:bg-red-600 border-red-300 text-primary-950  ";
      break;
    default:
      severityClasses = "bg-blue-500 hover:bg-blue-600 border-gray-300 text-secondary-200  ";
  }

  return (
    <button
      className={`flex flex-row justify-start gap-5 px-4 py-2 text-sm font-medium ${severityClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled = {disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
