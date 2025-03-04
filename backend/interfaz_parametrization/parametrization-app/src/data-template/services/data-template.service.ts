import { Inject, Injectable } from '@nestjs/common';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { DataTemplateRepository } from '../db/repository/data-template.repository';
import { CreateDataTemplateDto } from '../dto/create-data-template.dto';
import { UpdateDataTemplateDto } from '../dto/update-data-template.dto';

@Injectable()
export class DataTemplateService {
  constructor(
      @Inject('DataTemplateRepositoryInterface')
      private readonly dataTemplateRepository: DataTemplateRepository,
    ) {
    }
  create(createDataTemplateDto: CreateDataTemplateDto) {
    createDataTemplateDto.createdAt = new Date();
    createDataTemplateDto.updatedAt = new Date();
    return this.dataTemplateRepository.create(createDataTemplateDto);
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.dataTemplateRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.dataTemplateRepository.findOneById(id);
  }

  findByTemplate(id_template: string) {
    return this.dataTemplateRepository.findByTemplate(id_template);
  }

  update(id: string, updateDataTemplateDto: UpdateDataTemplateDto) {
    return this.dataTemplateRepository.update(id, updateDataTemplateDto);
  }

  remove(id: string) {
    return this.dataTemplateRepository.delete(id);
  }

  removeByTemplate(id_template: string) {
    return this.dataTemplateRepository.deleteByTemplate(id_template);
  }
}
