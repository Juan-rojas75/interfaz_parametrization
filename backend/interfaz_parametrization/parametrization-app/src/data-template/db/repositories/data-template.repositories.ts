import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";
import { CreateDataTemplateDto } from "src/data-template/dto/create-data-template.dto";

export interface DataTemplateRepositorie<DataTemplate> {
    create(createDto: Partial<CreateDataTemplateDto>): Promise<DataTemplate>;
    findOneById(id: string): Promise<DataTemplate | null>;
    findByTemplate(id: string): Promise<DataTemplate[] | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<DataTemplate>): Promise<DataTemplate | null>;
    delete(id: string): Promise<boolean>;
    deleteByTemplate(template: string): Promise<boolean>;
  }