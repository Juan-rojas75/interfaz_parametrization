import { useState, useEffect } from "react";
import { FieldConfig } from "./interfaces/FieldConfig.interface";
import { FieldConfigModalProps } from "./interfaces/ConfigModal.interface";
import DropDown from "@/app/shared/components/dropdown/dropdown.component";
import Modal from "@/app/shared/components/modal/modal.component";
import Button from "@/app/shared/components/button/button.component";
import { dateFormats } from "./const/date.const";
import { typesOptions } from "./const/type.const";
import { completedOptions } from "./const/completed.const";
import { alignOptions } from "./const/align.const";

export default function FieldConfigModal({ field, onSave, onCancel }: Readonly<FieldConfigModalProps>) {
  const [config, setConfig] = useState<FieldConfig>({
    name: field.config?.name || "",
    link_name: field.config?.link_name || "",
    size: field.config?.size || 0,
    ...field.config, // Mantiene los valores por defecto de `field.config`
  });

  const [transformation, setTransformation] = useState<{ default: string; replace: string }[]>([]);

  useEffect(() => {
    if (field.config?.transformation) {
      setTransformation(field.config.transformation);
    }
  }, [field.config?.transformation]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      ...field.config,
    }));
  }, [field.config]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!config.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!config.link_name.trim()) newErrors.link_name = "El link name es obligatorio";
    if (config.size && config.size <= 0) newErrors.size = "El tamaño debe ser mayor a 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || 0 : value,
    }));
  };

  const handleSelectChange = (fiedConfig: string, option: { value: string | number; name: string }) => {
    setConfig((prev) => ({
      ...prev,
      [fiedConfig]: option.value,
    }));
  };

  useEffect(() => {
    if (field.valuesDefault) {
      if (field.config?.transformation) {
        setTransformation(field.config.transformation);
      }
      else{
        setTransformation(field.valuesDefault.map((value: { value: number; name: string }) => ({ default: value.name, replace: "" })));
      }
    }
  }, [field.valuesDefault]);

  const handleTransformationChange = (index: number, newValue: string) => {
    setTransformation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, replace: newValue } : item))
    );
  };
  useEffect(() => {
    setConfig((prev) => ({ ...prev, transformation }));
  }, [transformation]);

  const handleSave = () => {
    if (validate()) {
      onSave(field.id, config);
    }
  };

  return (
    <Modal>
      <div className="bg-white p-6 rounded shadow w-96 text-primary-950">
        <h2 className="text-xl font-semibold mb-4">Configurar {field.name}</h2>

        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="text-base font-semibold mb-1">Nombre del Campo</label>
          <input
            id="name"
            type="text"
            name="name"
            value={config.name}
            onChange={handleChange}
            className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Link Name */}
        <div className="mb-4">
          <label htmlFor="link_name" className="text-base font-semibold mb-1">Link Name del Campo</label>
          <input
            id="link_name"
            type="text"
            name="link_name"
            value={config.link_name}
            onChange={handleChange}
            className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
          />
          {errors.link_name && <p className="text-red-500 text-xs">{errors.link_name}</p>}
        </div>

        {/* Default */}
        <div className="mb-4">
          <label htmlFor="link_name" className="text-base font-semibold mb-1">Valor predeterminado</label>
          <input
            id="default"
            type="text"
            name="default"
            value={config.default}
            onChange={handleChange}
            className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
          />
          {errors.default && <p className="text-red-500 text-xs">{errors.default}</p>}
        </div>

        {/* Tamaño */}
        <div className="mb-4">
          <label htmlFor="size" className="text-base font-semibold mb-1">Tamaño del Campo</label>
          <input
            id="size"
            type="number"
            name="size"
            value={config.size}
            onChange={handleChange}
            className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
          />
          {errors.size && <p className="text-red-500 text-xs">{errors.size}</p>}
        </div>

        {/* Dropdowns */}
        <div className="mb-4 w-full">
          <DropDown
            title="Tipo de Dato"
            options={typesOptions}
            value={typesOptions.find((type) => type.value === config.type)}
            onSelect = {(option) => {handleSelectChange("type",option)}}
          />
        </div>
          
        {/* Tipo fecha */}
        {config.type === "date" && (
          <div className="mb-4 w-full">
            <DropDown
              title="Formato de Fecha"
              options={dateFormats}
              value={dateFormats.find((format) => format.value === config.format_date)}
              onSelect={(option) => handleSelectChange("format_date", option)}
            />
          </div>
        )}

        <div className="mb-4 w-full">
          <DropDown
            title="Completar con"
            options={completedOptions}
            value={completedOptions.find((completed) => completed.value === config.completed)}
            onSelect = {(option) => {handleSelectChange("completed",option)}}
          />
        </div>

        <div className="mb-4 w-full">
          <DropDown
            title="Alinear"
            options={alignOptions}
            value={alignOptions.find((align) => align.value === config.align)}
            onSelect = {(option) => {handleSelectChange("align",option)}}
          />
        </div>

        {/* Transformación */}
        {field.valuesDefault && (
              <div className="mb-4">
                <label className="text-base font-semibold mb-1">Transformación</label>
                {transformation.map((item, index) => (
                  <div key={index} className="mb-2">
                    <span className="block text-sm font-medium">{item.default}</span>
                    <input
                      type="text"
                      value={item.replace}
                      onChange={(e) => handleTransformationChange(index, e.target.value)}
                      placeholder="Nuevo valor"
                      className="w-full p-2 text-sm text-primary-950 border border-secondary-200 rounded-md focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <div className="flex max-w-fit">
            <Button severity="danger" onClick={onCancel}>Cancelar</Button>
          </div>
          <div className="flex max-w-fit">
            <Button severity="primary" onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
