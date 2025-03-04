import { Inject, Injectable } from '@nestjs/common';
import { CreateColumnsDto } from "src/Columns/dto/create-columns.dto";
import { UpdateColumnsDto } from "src/Columns/dto/update-columns.dto";
import { ColumnsRepository } from '../db/repository/column.repository';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';

@Injectable()
export class ColumnsService {
  constructor(
      @Inject('ColumnsRepositoryInterface')
      private readonly columnsRepository: ColumnsRepository,
    ) {
    }
  create(createDto: CreateColumnsDto) {

    return this.columnsRepository.create(createDto);
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.columnsRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.columnsRepository.findOneById(id);
  }

  update(id: string, updateDto: UpdateColumnsDto) {
    return this.columnsRepository.update(id, updateDto);
  }

  remove(id: string) {
    return this.columnsRepository.delete(id);
  }
}
