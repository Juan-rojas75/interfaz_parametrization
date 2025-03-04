import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export interface IColumnRepositorie<Column> {
    create(createDto: Partial<Column>): Promise<Column>;
    findOneById(id: string): Promise<Column | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<Column>): Promise<Column | null>;
    delete(id: string): Promise<boolean>;
  }