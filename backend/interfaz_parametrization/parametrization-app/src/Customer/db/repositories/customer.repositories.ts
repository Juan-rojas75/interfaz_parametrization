import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export interface CustomerRepositorie<Customer> {
    create(createDto: Partial<Customer>): Promise<Customer>;
    findOneById(id: string): Promise<Customer | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<Customer>): Promise<Customer | null>;
    delete(id: string): Promise<boolean>;
  }