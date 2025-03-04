import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export interface IRolRepositorie<Rol> {
    create(createDto: Partial<Rol>): Promise<Rol>;
    findOneById(id: string): Promise<Rol | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<Rol>): Promise<Rol | null>;
    delete(id: string): Promise<boolean>;
  }