"use client";
import Button from "@/app/shared/components/button/button.component";
import Paginator from "../paginator/paginator";
import { TableProps } from "./interfaces/table.interface";
import { formatValue } from "@/app/utils/formatValue.util";

export function Table({ columns, paginator, data, actions, addClick, editClick, deleteClick, pageClick }: Readonly<TableProps>) {
  return (
    <article>
      <table className="text-left border-collapse w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className="py-2 text-primary-950 min-w-[10rem]" key={column.id}>{column.name}</th>
            ))}
            {actions.edit && <th className="py-2 text-primary-950 min-w-[10rem]">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id || row._id }>
              {columns.map((column) => (
                <td className="p-2 border-primary2 border-y text-accent1 text-primary-900" key={column.id}>{formatValue(row[column.field])}</td>
              ))}
              {actions.edit && (
                <td className="py-2 border-primary2 border-y text-accent1 font-bold text-primary-900">
                  <div className="flex gap-2">
                    <Button severity="primary" active={actions.edit} onClick={() => editClick(row)}>
                      Editar
                    </Button>
                    <Button severity="danger" active={actions.delete} onClick={() => deleteClick(row)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <section className="flex justify-between gap-10 py-2">
        <Paginator paginator={paginator} changePage={pageClick} />
        <div className="w-fit">
          <Button severity="primary" active={actions.add} onClick={() => addClick()}>
            Agregar
          </Button>
        </div>
      </section>
    </article>
  );
}