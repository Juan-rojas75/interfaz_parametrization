import { FieldConfig } from "./FieldConfig.interface";

export interface Field {
    id: string;
    name: string;
    valuesDefault: ValuesDefault[];
    config?: FieldConfig;
  }

export interface ValuesDefault {
    value: number;
    name: string;
  }
