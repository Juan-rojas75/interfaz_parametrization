export interface Column {
    id: number;
    field: string;
    name: string;
}
export interface Actions {
    add: boolean;
    edit: boolean;
    delete: boolean;
}
export interface TableProps {
    columns: Column[];
    paginator: {total: number, page: number, pages: number, items_per_page: number};
    data: any[];
    actions: Actions,
    addClick: () => void,
    editClick: (item: any) => void,
    deleteClick: (item: any) => void,
    pageClick: (page: number) => void,
}