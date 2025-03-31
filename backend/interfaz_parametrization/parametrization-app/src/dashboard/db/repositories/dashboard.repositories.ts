import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";
import { CreateDashboardDto } from "src/dashboard/dto/create-dashboard.dto";
import { CreateDataTemplateDto } from "src/data-template/dto/create-data-template.dto";

export interface DashboardRepositorie<Dashboard> {
    create(createDto: Partial<CreateDashboardDto>): Promise<Dashboard>;
    findOneById(id: string): Promise<Dashboard | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<CreateDashboardDto>): Promise<Dashboard | null>;
    delete(id: string): Promise<boolean>;
  }