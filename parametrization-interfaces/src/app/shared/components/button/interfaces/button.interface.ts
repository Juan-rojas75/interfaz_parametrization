// interfaces/button.interface.ts
export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean ;
  severity: "primary" | "secondary" | "danger" |"default";
  children: React.ReactNode; // Permite pasar cualquier tipo de contenido como hijo
}
