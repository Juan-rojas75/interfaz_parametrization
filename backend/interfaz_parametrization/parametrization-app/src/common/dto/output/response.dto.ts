export class ResponseDto {

    data: any;
    meta: {
        paginator: {
            total: number;
            page: number;
            pages: number;
            items_per_page: number;
        };
        status: number;
        message: string;
    }
}