import { FieldConfig } from "./FieldConfig.interface";
import { ItemType } from "../../DragDrop/drag-drop.component";

export interface FieldConfigModalProps {
    field: ItemType;
    onSave: (fieldId: string, config: FieldConfig) => void;
    onCancel: () => void;
  }