'use client';

import React, { useState } from 'react';
import Button from '@/app/shared/components/button/button.component';
import { ItemType } from '../DragDrop/drag-drop.component';
import Modal from '@/app/shared/components/modal/modal.component';
import DropDown from '@/app/shared/components/dropdown/dropdown.component';

interface FieldCreationModalProps {
  field: any | null;
  onSave: (field: Omit<ItemType, 'id'>) => void;
  onCancel: () => void;
}

const FieldCreationModal: React.FC<FieldCreationModalProps> = ({ field, onSave, onCancel }) => {

  const [fieldName, setFieldName] = useState(field?.name || '');
  const [fieldType, setFieldType] = useState('string');
  const [valuesDefault, setValuesDefault] = useState<Array<{ value: number; name: string }>>(field?.valuesDefault || []);
  const [newValueName, setNewValueName] = useState('');

  const handleAddDefaultValue = () => {
    if (newValueName.trim()) {
      setValuesDefault((prev) => [
        ...prev,
        { value: prev.length + 1, name: newValueName },
      ]);
      setNewValueName('');
    }
  };

  const handleRemoveDefaultValue = (index: number) => {
    setValuesDefault((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (fieldName.trim()) {
      onSave({
        name: fieldName,
        container: 'columns',
        valuesDefault: valuesDefault.length > 0 ? valuesDefault : undefined,
        index: 0,
      });
    }
  };

  return (
    <Modal>
      <div className="text-primary-950 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Crear Nuevo Campo</h2>
        <div className="mb-4">
        <h2 className="text-base font-semibold mb-1">Nombre del campo</h2>
          <input
            id="field-name"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="w-full p-2 text-sm text-primary-950 border border-primary-200 rounded-md max-w-screen-sm focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <DropDown
            title="Tipo de Campo"
            options={[
              { value: 1, name: "Texto" },
              { value: 2, name: "Número" },
              { value: 3, name: "Fecha" },
            ]}
            onSelect={(option) => {setFieldType(option.name)}}/>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold mb-1">Valores Predeterminados (Opcional)</h2>

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <input
                id="default-values"
                type="text"
                value={newValueName}
                onChange={(e) => setNewValueName(e.target.value)}
                className="w-full p-2 text-sm text-primary-950 border border-primary-200 rounded-md max-w-screen-sm focus:outline-none"
              />
              <div className="flex max-w-fit">
              <Button severity="primary" onClick={handleAddDefaultValue} > Añadir</Button>
              </div>
            </div>

            <ul className="mt-2 space-y-1">
              {valuesDefault.map((value, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-md bg-gray-100 p-2 text-sm"
                >
                  {value.name}
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleRemoveDefaultValue(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button severity="danger" onClick={onCancel} > Cancelar</Button>
          <div className="flex max-w-fit">
            <Button severity="primary" onClick={handleSave} > Guardar</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FieldCreationModal;
