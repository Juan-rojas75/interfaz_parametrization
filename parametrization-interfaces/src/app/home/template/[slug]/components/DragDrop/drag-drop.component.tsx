"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {  arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Container } from "../Container/container.component";
import { FieldConfig } from "../ConfigModal/interfaces/FieldConfig.interface";
import { FieldsSummary } from "../FieldSumary/field-sumary.component";
import Button from "@/app/shared/components/button/button.component";
import FieldCreationModal from "../FieldCreationalModal/field-creational-modal.component";

export type ItemType = {
  id: string;
  index: number;
  name: string;
  container: string;
  valuesDefault?: Array<{ value: number; name: string }>;
  config?: FieldConfig;
};

// Actualizamos los contenedores
const containers = [
  {
    id: "columns",
    title: "Columnas",
  },
  {
    id: "file-structure",
    title: "Estructura del archivo",
  },
];

interface DragDropProps {
  itemsInit: ItemType[];
  onConfigSave: (fields: ItemType[]) => void;
}

export function DragDropDemo({itemsInit, onConfigSave }: Readonly<DragDropProps>) {
  const [items, setItems] = useState<ItemType[]>(itemsInit);
  const [configuredFields, setConfiguredFields] = useState<ItemType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showFieldCreationModal, setShowFieldCreationModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const active = React.useMemo(() => items.find((item) => item.id === activeId), [items, activeId]);

  const itemsByContainer = React.useMemo(() => {
    return containers.reduce((acc, container) => {
      acc[container.id] = items.filter((item) => item.container === container.id);
      return acc;
    }, {} as Record<string, ItemType[]>);
  }, [items]);

  // Funcion para manejar el evento onDragStart
  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  // Funcion para manejar el evento onDragEnd
function handleDragEnd(event: any) {
  const { active, over } = event;

  if (!over) {
    setActiveId(null);
    return;
  }
  
  const activeContainer = items.find((item) => item.id === active.id)?.container;
  const overContainer = items.find((item) => item.id === over.id)?.container || over.id;
  
  setItems((items) => {
    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    let updatedItems;
    if (activeContainer === overContainer) {
      updatedItems = arrayMove(items, activeIndex, overIndex);
    } else {
      updatedItems = items.map((item) =>
        item.id === active.id ? { ...item, container: overContainer } : item
      );
    }
    // Asignar el índice correcto a cada elemento
    return updatedItems.map((item, index) => ({ ...item, index: index + 1 }));
  });

  setActiveId(null);
}
  
  // Funcion para manejar el evento onDragCancel
  function handleDragCancel() {
    setActiveId(null);
  }

  useEffect(() => {

    setConfiguredFields(items.filter((item) => item.container === "file-structure" && item.config));
  }, [items]);

  // Maneja la configuración guardada y llama al callback del padre
  const handleConfigSave = (fieldId: string, config: FieldConfig) => {
    const fields_ = items.map((item) => {
      return { ...item, config: item.id === fieldId ? config : item.config };
    });
    setItems(fields_);
    const configuredFields = fields_.filter((item) => item.container === "file-structure" && item.config);
    setConfiguredFields(configuredFields);
    onConfigSave(configuredFields);
  };

  //Funcion para manejar la creación de un nuevo campo
  function handleCreateField(newField: Omit<ItemType, "id">) {
    const newFieldWithId = {
      ...newField,
      id: (items.length + 1).toString(),
      index: items.length + 1,
    };
    setItems((prev) => [...prev, newFieldWithId]);
  }

  
  return (
    <div className="flex flex-col gap-4 w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-col justify-between gap-10 p-4">
          <div className="max-w-40">
            <Button severity="primary" active={true} onClick={() => setShowFieldCreationModal(true)} >
              Crear campo
            </Button>
          </div>
          <div className="flex flex-col gap-4 w-full md:flex-row">
            {containers.map((container) => (
              <Container
                key={container.id}
                id={container.id}
                title={container.title}
                items={itemsByContainer[container.id] || []}
                showConfigButton={container.id === "file-structure"}
                onConfigSave={handleConfigSave}
              />
            ))}
          </div>
        </div>


        <DragOverlay>
          {activeId ? (
            <div className="rounded-lg border bg-white p-4 text-white-foreground shadow-lg">{active?.name}</div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showFieldCreationModal && (
        <FieldCreationModal
          onSave={(newField) => {
            handleCreateField(newField);
            setShowFieldCreationModal(false);
          }}
          onCancel={() => setShowFieldCreationModal(false)}
        />
      )}

      {configuredFields.length > 0 && <FieldsSummary fields={configuredFields} />}
    </div>
  );
}
