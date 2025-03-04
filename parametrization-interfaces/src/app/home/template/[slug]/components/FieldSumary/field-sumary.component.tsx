import { ItemType } from "../DragDrop/drag-drop.component"

interface FieldsSummaryProps {
  fields: ItemType[];
}

function TableRow({ field }: { field: ItemType }) {
  return (
    <tr key={field.id} className="p-3 m-2 border-b border-gray-200 hover:bg-gray-200">
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.name}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.name}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.link_name}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.default}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.size}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.type}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.format_date}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.align}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.transformation?.map((t) => t.replace).join(', ')}</td>
      <td className="py-2 border-primary2 border-y text-accent1 text-primary-900">{field.config?.completed}</td>
    </tr>
  );
}

export function FieldsSummary({ fields }: FieldsSummaryProps) {
  return (
    <div className="shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Resumen de Campos</h2>
      {/* Tabla de resumen */}
      <div className="overflow-x-auto">
        <table className="text-left border-collapse w-full">
          <thead>
            <tr >
              <th className="py-2 text-primary-950 min-w-[10rem]">Campo</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Nombre</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Link name</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Valor predeterminado</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Tamaño</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Tipo</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Formato de fecha</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Alineación</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Transformación</th>
              <th className="py-2 text-primary-950 min-w-[10rem]">Completado</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <TableRow key={field.id} field={field} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function getTipoLabel(type: string): string {
  const tipos = {
    string: "Texto",
    number: "Número",
    date: "Fecha",
    boolean: "Booleano",
    email: "Email",
  }
  return tipos[type as keyof typeof tipos] || type
}

// function getValidationSummary(config: FieldConfig): string {
//   if (!config.validation) return "-"

//   const validations = []
//   if (config.validation.min !== undefined) {
//     validations.push(`Mín: ${config.validation.min}`)
//   }
//   if (config.validation.max !== undefined) {
//     validations.push(`Máx: ${config.validation.max}`)
//   }
//   if (config.validation.pattern) {
//     validations.push(`Patrón: ${config.validation.pattern}`)
//   }

//   return validations.length > 0 ? validations.join(", ") : "-"
// }

