import { useState } from "react";
import { Option } from "./interfaces/OptionItem.interface";
import { DropDownProps } from "./interfaces/DropDwonProps.interface";


export default function DropDown({ title, options , value, onSelect }: Readonly<DropDownProps>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option | null>(value || null);
  // Función para manejar la apertura/cierre del dropdown
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Función para manejar la selección de una opción
  const handleOptionSelect = (option: Option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false)
  };

  return (
    <div className="relative max-w-screen-sm inline-block text-left w-full">
        <h2 className="text-base font-semibold mb-1">{title}</h2>
        <div className="flex flex-row w-full justify-between gap-2">
          <button
            type="button"
            className="flex flex-row justify-between w-full rounded-md border border-primary-200 shadow-sm px-4 py-2 text-sm font-medium text-secondary-950 "
            id="options-menu"
            onClick={toggleDropdown}
          >
              <div className="flex flex-row justify-between w-full">
                  <span>{selected?.value ? selected.name : "Seleccionar"}</span>
                  {isOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m7 14l5-5l5 5z"/></svg>
                  ):
                  (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path
                      fill="currentColor"
                      d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
                      />
                  </svg>
                  )}
                  
              </div>
          </button>
          {selected && (
              <button onClick={() => handleOptionSelect({value: 0, name: ""})}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
            </button>
          )}
          
        </div>

      {isOpen && (
        <div
          className="flex flex-col absolute z-10 mt-2 w-full rounded-md shadow-lg origin-top-left left-0 bg-secondary-50 ring-1 ring-black ring-opacity-5">
          <div className="py-1 rounded-md">
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-primary-950 hover:bg-secondary-100"
                onClick={() => handleOptionSelect(option)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleOptionSelect(option);
                  }
                }}
                role="menuitem"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
