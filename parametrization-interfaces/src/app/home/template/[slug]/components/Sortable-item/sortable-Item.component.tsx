'use client';

import Button from "@/app/shared/components/button/button.component";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FieldConfigModal from "../ConfigModal/ConfigModal.component";
import { useState } from "react";
import { ItemType } from "../DragDrop/drag-drop.component";
import { FieldConfig } from "../ConfigModal/interfaces/FieldConfig.interface";
import FieldCreationModal from "../FieldCreationalModal/field-creational-modal.component";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  showConfigButton?: boolean;
  field: ItemType;
  onConfigSave: (fieldId: string, config: FieldConfig) => void;
}

export function SortableItem({
  id,
  children,
  showConfigButton = false,
  field,
  onConfigSave, // Callback recibido como prop
}: Readonly<SortableItemProps>) {
  const [configField, setConfigField] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Maneja la configuración guardada y llama al callback del padre
  const handleSaveConfig = (fieldId: string, config: FieldConfig) => {
    onConfigSave(fieldId, config);
    setConfigField(false);
  };

  const info = (config: any) => {
    if(config.container === "columns") {
      onConfigSave("edit-init", config);
    }else{
      setConfigField(true);
    }
  };

  return (
    <div className="flex flex-row gap-2 align-middle items-center w-full justify-stretch">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`flex w-full cursor-grab items-center justify-between rounded-lg border bg-white p-4 text-white-foreground shadow-sm hover:shadow-md ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <span>{children}</span>
      </div>
      <div>
        {showConfigButton && (
          <Button severity="secondary" onClick={() => info(field)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="m24 4l-6 6h-8v8l-6 6l6 6v8h8l6 6l6-6h8v-8l6-6l-6-6v-8h-8z"/><path d="M24 30a6 6 0 1 0 0-12a6 6 0 0 0 0 12Z"/></g></svg>
          </Button>
        )}
        {/* Configuración de Campo */}
        {configField && (
          <FieldConfigModal
            field={field}
            onSave={handleSaveConfig}
            onCancel={() => setConfigField(false)}
          />
        )}
      </div>
    </div>
  );
}
