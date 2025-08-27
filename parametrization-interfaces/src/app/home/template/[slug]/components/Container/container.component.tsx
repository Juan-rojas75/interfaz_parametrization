import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "../Sortable-item/sortable-Item.component"
import { ItemType } from "../DragDrop/drag-drop.component"
import { FieldConfig } from "../ConfigModal/interfaces/FieldConfig.interface"


interface ContainerProps {
  id: string
  title: string
  items: ItemType[]
  showConfigButton?: boolean
  onConfigSave: (fieldId: string, config: FieldConfig) => void; // Callback para enviar datos al padre
  emptyState?: React.ReactNode; 
}

export function Container({ id, title, items, showConfigButton = false , onConfigSave}: ContainerProps) {
  const { setNodeRef } = useDroppable({
    id,
  })
  const handleConfigSave = (fieldId: string, config: FieldConfig) => {
    onConfigSave(fieldId, config);
  };
  return (
    <div className="flex w-96 flex-col gap-4 rounded-lg border bg-muted/50 p-4 md:w-full">
      <div className="text-lg font-semibold">{title}</div>
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} field={item} showConfigButton={showConfigButton} onConfigSave={handleConfigSave}>
              {item.name}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

