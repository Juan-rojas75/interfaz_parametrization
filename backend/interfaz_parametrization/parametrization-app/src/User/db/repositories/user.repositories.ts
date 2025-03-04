import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export interface IUserRepositorie<User> {
    create(createDto: Partial<User>): Promise<User>;
    findOneById(id: string): Promise<User | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    update(id: string, updateDto: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
  }