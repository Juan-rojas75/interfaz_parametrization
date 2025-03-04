export interface Paginator {
    paginator: {
        total: number;
        page: number;
        pages: number;
        items_per_page: number
    },
    changePage: (page: number) => void
}