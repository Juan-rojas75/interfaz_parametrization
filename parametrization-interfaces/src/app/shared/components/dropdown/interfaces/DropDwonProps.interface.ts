import { Option } from "./OptionItem.interface";

export interface DropDownProps {
    title: string;
    value?: Option;
    options: Option[];
    onSelect: (selectedOption: Option) => void;
}