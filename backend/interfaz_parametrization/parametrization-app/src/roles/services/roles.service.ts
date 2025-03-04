import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../db/repository/rol.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';

@Injectable()
export class RolesService {
  constructor(@Inject('RolesRepositoryInterface') private readonly rolesRepository:RolesRepository) {}
  create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  findAll( paginatorDto:PaginatorDto ) {
    return this.rolesRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.rolesRepository.findOneById(id);
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  remove(id: string) {
    return this.rolesRepository.delete(id);
  }
}
