"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  MeasuringStrategy,
  Announcements,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Button from "@/app/shared/components/button/button.component";
import { Container } from "../Container/container.component";
import FieldCreationModal from "../FieldCreationalModal/field-creational-modal.component";
import { FieldsSummary } from "../FieldSumary/field-sumary.component";
import type { FieldConfig } from "../ConfigModal/interfaces/FieldConfig.interface";

export type ItemType = {
  id: string;
  index: number;
  name: string;
  container: string;
  valuesDefault?: Array<{ value: number; name: string }>;
  config?: FieldConfig;
};

const CONTAINERS = [
  { id: "columns", title: "Columnas" },
  { id: "file-structure", title: "Estructura del archivo" },
] as const;

type DragDropProps = {
  itemsInit: ItemType[];
  onConfigSave: (fields: ItemType[]) => void;
};

export function FirstLineComponent({ itemsInit, onConfigSave }: Readonly<DragDropProps>) {
  // Estado
  const [items, setItems] = React.useState<ItemType[]>(() => itemsInit);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [ghostText, setGhostText] = React.useState<string | null>(null);
  const [configuredFields, setConfiguredFields] = React.useState<ItemType[]>([]);
  const [showFieldCreationModal, setShowFieldCreationModal] = React.useState(false);
  const [editingField, setEditingField] = React.useState<ItemType | null>(null);

  // Sensores
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Lookup rápido por contenedor
  const itemsByContainer = React.useMemo(() => {
    return CONTAINERS.reduce((acc, c) => {
      acc[c.id] = items.filter((it) => it.container === c.id);
      return acc;
    }, {} as Record<string, ItemType[]>);
  }, [items]);

  // Activo
  const active = React.useMemo(() => items.find((it) => it.id === activeId) || null, [items, activeId]);

  // Anuncios accesibles (screen readers)
  const announcements: Announcements = {
    onDragStart({ active }) {
      return `${String(active?.id)} seleccionado. Usa flechas para mover.`;
    },
    onDragOver({ active, over }) {
      if (!over) return;
      return `${String(active?.id)} sobre ${String(over?.id)}`;
    },
    onDragEnd({ active, over }) {
      if (!over) return `${String(active?.id)} soltado.`;
      return `${String(active?.id)} soltado sobre ${String(over?.id)}`;
    },
    onDragCancel() {
      return `Movimiento cancelado.`;
    },
  };
  const accessibility = React.useMemo(() => ({ announcements }), [announcements]);

  // Handlers DnD
  function handleDragStart(event: any) {
    setActiveId(event.active.id);
    const name = items.find((i) => i.id === event.active.id)?.name || null;
    setGhostText(name);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIdx = items.findIndex((i) => i.id === active.id);
    const overIdx = items.findIndex((i) => i.id === over.id);

    // Si suelto sobre un contenedor vacío, "over.id" será el id del contenedor,
    // en ese caso cambiamos sólo el container del item activo
    const overIsContainer = CONTAINERS.some((c) => c.id === over.id);

    setItems((prev) => {
      let next = [...prev];
      if (overIsContainer) {
        next = next.map((it) => (it.id === active.id ? { ...it, container: over.id } : it));
      } else if (activeIdx >= 0 && overIdx >= 0) {
        const sameContainer = prev[activeIdx].container === prev[overIdx].container;
        next = sameContainer ? arrayMove(prev, activeIdx, overIdx) : prev.map((it) => (it.id === active.id ? { ...it, container: prev[overIdx].container } : it));
      }
      // Re-index orden 1..N
      return next.map((it, idx) => ({ ...it, index: idx + 1 }));
    });

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const configured = React.useMemo(
    () => items.filter(it => it.container === "file-structure" && it.config),
    [items]
  );

  // guarda un hash para evitar disparos repetidos
  const prevHashRef = React.useRef<string>("");

  React.useEffect(() => {
    const hash = JSON.stringify(
      configured.map(({ id, container, index, config }) => ({ id, container, index, config }))
    );
    if (hash !== prevHashRef.current) {
      prevHashRef.current = hash;
      setConfiguredFields(configured); // si mantienes este estado
      onConfigSave(configured);
    }
  }, [configured, onConfigSave]);

  // Guardar config de un campo
  const handleConfigSave = (fieldId: string, config: FieldConfig) => {
    if (fieldId === "edit-init") {
      // Abrir modal de creación/edición
      setEditingField((config as unknown as ItemType) ?? null);
      setShowFieldCreationModal(true);
      return;
    }
    setItems((prev) => prev.map((it) => (it.id === fieldId ? { ...it, config } : it)));
  };

  // Crear o reemplazar campo
  function handleCreateField(newField: ItemType) {
    setItems((prev) => {
      const exists = prev.find((it) => it.id === newField.id);
      if (exists && editingField) {
        return prev.map((it) => (it.id === editingField.id ? { ...newField, id: editingField.id, index: editingField.index } : it));
      }
      return [
        ...prev,
        {
          ...newField,
          id: String(prev.length + 1),
          index: prev.length + 1,
        },
      ];
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-semibold text-primary-950">Constructor de estructura</h3>
          <p className="text-xs text-primary-800/70">Arrastra campos entre columnas y estructura. Usa teclado: Tab/Shift+Tab, Enter, ↑/↓</p>
        </div>
        <div className="w-full max-w-40 sm:w-auto">
          <Button severity="primary" onClick={() => { setEditingField(null); setShowFieldCreationModal(true); }}>Crear campo</Button>
        </div>
      </div>

      {/* Contadores */}
      <div className="flex flex-wrap gap-2 px-4 text-xs text-primary-800/70">
        {CONTAINERS.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1 rounded-full border border-secondary-200 bg-white px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            {c.title}: <b>{itemsByContainer[c.id]?.length ?? 0}</b>
          </span>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={accessibility}
      >
        <div className="flex w-full flex-col gap-4 p-4 md:flex-row">
          {CONTAINERS.map((container) => (
            <div key={container.id} className="flex-1">
              <Container
                id={container.id}
                title={container.title}
                items={itemsByContainer[container.id] || []}
                showConfigButton
                onConfigSave={handleConfigSave}
                // Placeholders UX cuando está vacío
                emptyState={(
                  <div className="grid h-24 place-items-center rounded-xl border border-dashed border-secondary-300 bg-secondary-50 text-xs text-primary-700/70">
                    Suelta campos aquí
                  </div>
                )}
              />
            </div>
          ))}
        </div>

        {/* Overlay fantasma */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? (
            <div className="pointer-events-none select-none rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm text-primary-900 shadow-xl">
              {ghostText}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Summary */}
      {configuredFields.length > 0 && (
        <div className="p-4">
          <FieldsSummary fields={configuredFields} />
        </div>
      )}

      {/* Modal creación/edición */}
      {showFieldCreationModal && (
        <FieldCreationModal
          field={editingField ?? null}
          onSave={(nf) => {
            handleCreateField(nf as ItemType);
            setShowFieldCreationModal(false);
          }}
          onCancel={() => setShowFieldCreationModal(false)}
        />
      )}

      {/* Estilos auxiliares para animaciones sutiles */}
      <style jsx global>{`
        .dnd-enter { animation: dndFade .12s ease-out both }
        @keyframes dndFade { from { opacity: .7; transform: scale(.99) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
