
export interface FieldConfig {
    name : string;
    link_name: string;
    default?: string;
    size?: number;
    type?: string;
    completed?: string;
    align?: string;
    format_date?: string;
    transformation?: ValuesDefault[];
  }

export interface ValuesDefault {
  default: string;
  replace: string;
}