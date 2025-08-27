'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Button from '@/app/shared/components/button/button.component';
import { ItemType } from '../DragDrop/drag-drop.component';
import Modal from '@/app/shared/components/modal/modal.component';
import DropDown from '@/app/shared/components/dropdown/dropdown.component';

interface FieldCreationModalProps {
  field: Partial<ItemType> | null; // puede venir parcial al editar
  onSave: (field: Omit<ItemType, 'id'>) => void;
  onCancel: () => void;
}

const TYPE_OPTIONS = [
  { value: 'string', name: 'Texto' },
  { value: 'number', name: 'Número' },
  { value: 'date',   name: 'Fecha'  },
] as const;

const FieldCreationModal: React.FC<FieldCreationModalProps> = ({ field, onSave, onCancel }) => {
  // Estado
  const [fieldName, setFieldName] = useState<string>(field?.name ?? '');
  const [fieldType, setFieldType] = useState<{ value: string; name: string }>(TYPE_OPTIONS[0]);
  const [valuesDefault, setValuesDefault] = useState<Array<{ value: number; name: string }>>(field?.valuesDefault ?? []);
  const [newValueName, setNewValueName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Si el modal se abre en modo edición, sincroniza estado
  useEffect(() => {
    setFieldName(field?.name ?? '');
    setValuesDefault(field?.valuesDefault ?? []);
    // si en el futuro traes tipo desde field.config, ajusta aquí
  }, [field]);

  // Validación simple
  useEffect(() => {
    if (!fieldName.trim()) setError('El nombre es obligatorio.');
    else if (fieldName.trim().length < 2) setError('Mínimo 2 caracteres.');
    else setError('');
  }, [fieldName]);

  const canSave = useMemo(() => !error && fieldName.trim().length >= 2, [error, fieldName]);

  // Añadir por Enter
  const handleKeyDownNew = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDefaultValue();
    }
  };

  // Añadir valor por defecto (sin duplicados, trim)
  const handleAddDefaultValue = useCallback(() => {
    const name = newValueName.trim();
    if (!name) return;
    const exists = valuesDefault.some(v => v.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      // feedback corto visual: sacude el input (opcional) o selecciona texto
      inputRef.current?.select();
      return;
    }
    setValuesDefault(prev => [...prev, { value: prev.length + 1, name }]);
    setNewValueName('');
    inputRef.current?.focus();
  }, [newValueName, valuesDefault]);

  const handleRemoveDefaultValue = (idx: number) => {
    setValuesDefault(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: fieldName.trim(),
      container: 'columns',
      // si no hay defaults, no enviar prop (mantiene tu contrato)
      valuesDefault: valuesDefault.length ? valuesDefault : undefined,
      index: 0,
      // Nota: si en el futuro quieres persistir fieldType, puedes guardarlo dentro de config
      // config: { type: fieldType.value } as any
    });
  };

  return (
    <Modal
      open={true}
      onClose={onCancel}
      title={field?.name ? 'Editar campo' : 'Crear nuevo campo'}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button severity="secondary" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button severity="primary" onClick={handleSave} disabled={!canSave}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className="text-primary-950 w-full max-w-lg">
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="field-name" className="mb-1 block text-sm font-medium">Nombre del campo</label>
          <input
            id="field-name"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className={`w-full rounded-lg border bg-white p-2 text-sm focus:outline-none focus:ring-2 ${
              error ? 'border-red-400 focus:ring-red-400' : 'border-secondary-300 focus:ring-primary-400'
            }`}
            placeholder="Ej: Código de cliente"
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Tipo */}
        <div className="mb-4">
          <DropDown
            title="Tipo de campo"
            options={TYPE_OPTIONS as any}
            value={fieldType as any}
            onSelect={(opt) => opt && setFieldType(opt as any)}
            helperText="Selecciona el tipo de dato esperado."
          />
        </div>

        {/* Valores por defecto */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-medium">Valores predeterminados (opcional)</h2>
            <span className="text-xs text-primary-800/70">{valuesDefault.length} ítem(s)</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              id="default-values"
              type="text"
              value={newValueName}
              onChange={(e) => setNewValueName(e.target.value)}
              onKeyDown={handleKeyDownNew}
              className="w-full rounded-lg border border-secondary-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Añade un valor y presiona Enter"
            />
            <Button severity="primary" onClick={handleAddDefaultValue}>Añadir</Button>
          </div>

          {/* Chips */}
          {valuesDefault.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {valuesDefault.map((v, i) => (
                <li key={`${v.name}-${i}`} className="group inline-flex items-center gap-1 rounded-full border border-secondary-300 bg-secondary-50 px-3 py-1 text-xs">
                  <span className="truncate max-w-[14rem]" title={v.name}>{v.name}</span>
                  <button
                    type="button"
                    aria-label={`Eliminar ${v.name}`}
                    onClick={() => handleRemoveDefaultValue(i)}
                    className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-primary-700/70 transition hover:bg-secondary-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.6 4.6l-1.4-1.4l4.6-4.6L6 7.4l1.4-1.4l4.6 4.6l4.6-4.6l1.4 1.4l-4.6 4.6l4.6 4.6l-1.4 1.4z"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Ayuda */}
          <p className="mt-2 text-[11px] text-primary-800/70">
            Los valores predeterminados son útiles para listas desplegables o catálogos. Evitamos duplicados automáticamente.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default FieldCreationModal;