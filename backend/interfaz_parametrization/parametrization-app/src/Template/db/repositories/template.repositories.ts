import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export interface TemplateRepositorie<Template> {
    create(createDto: Partial<Template>): Promise<Template>;
    findOneById(id: string): Promise<Template | null>;
    findByCustomer_Id(id_customer: string): Promise<Template[] | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<Template>): Promise<Template | null>;
    delete(id: string): Promise<boolean>;
  }