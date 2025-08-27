import { Inject, Injectable } from '@nestjs/common';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { TemplateRepository } from '../db/repository/template.repository';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { DataTemplateService } from 'src/data-template/services/data-template.service';
import { CreateDataTemplateDto } from 'src/data-template/dto/create-data-template.dto';

@Injectable()
export class TemplateService {
  constructor(
        @Inject('TemplateRepositoryInterface')
        private readonly templateRepository: TemplateRepository,
        private readonly dataTemplateService: DataTemplateService,
      ) {
      }
  async create(createTemplateDto: CreateTemplateDto) {
    createTemplateDto.createdAt = new Date();
    createTemplateDto.updatedAt = new Date();
    const { ["fields"]: _, ...data } = createTemplateDto;
    const template = await this.templateRepository.create(data);

    if (createTemplateDto && createTemplateDto.fields) {
      createTemplateDto.fields.map((field) => {
        let createDataTemplateDto = new CreateDataTemplateDto();
        createDataTemplateDto.template = template.id;
        createDataTemplateDto.index = field.index;
        createDataTemplateDto.length = field.config.size;
        createDataTemplateDto.name = field.config.name;
        createDataTemplateDto.link_name = field.config.link_name;
        createDataTemplateDto.default = field.config.default;
        createDataTemplateDto.type = field.config.type;
        createDataTemplateDto.format_date = field.config.format_date;
        createDataTemplateDto.complete_with = field.config.completed;
        createDataTemplateDto.align = field.config.align;
        createDataTemplateDto.value_default = field.valuesDefault;
        createDataTemplateDto.valuesTransform = field.config.transformation;
        createDataTemplateDto.first_line = field.first_line ?? false;
        this.dataTemplateService.create(createDataTemplateDto);
      })
    }
    return template;
  }


  findAll(paginatorDto:PaginatorDto) {
    return this.templateRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.templateRepository.findOneById(id);
  }

  findByCustomer_Id(id: string) {
    return this.templateRepository.findByCustomer_Id(id);
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    updateTemplateDto.updatedAt = new Date();
    const { ["fields"]: _, ...data } = updateTemplateDto;
    const template = await this.templateRepository.update(id, updateTemplateDto);

    // Remove all datatemplates
    await this.dataTemplateService.removeByTemplate(id);

    if (template && updateTemplateDto && updateTemplateDto.fields) {
      updateTemplateDto.fields.map((field) => {
        let createDataTemplateDto = new CreateDataTemplateDto();
        createDataTemplateDto.template = template.id;
        createDataTemplateDto.index = field.index;
        createDataTemplateDto.length = field.config.size;
        createDataTemplateDto.name = field.config.name;
        createDataTemplateDto.link_name = field.config.link_name;
        createDataTemplateDto.default = field.config.default;
        createDataTemplateDto.type = field.config.type;
        createDataTemplateDto.format_date = field.config.format_date;
        createDataTemplateDto.complete_with = field.config.completed;
        createDataTemplateDto.align = field.config.align;
        createDataTemplateDto.value_default = field.valuesDefault;
        createDataTemplateDto.valuesTransform = field.config.transformation;
        createDataTemplateDto.type_calcule = field.config.type_calcule ?? "";
        createDataTemplateDto.first_line = field.first_line ?? false;
        this.dataTemplateService.create(createDataTemplateDto);
      })
    }
    return template;
  }

  async remove(id: string) {
    // Remove all datatemplates
    await this.dataTemplateService.removeByTemplate(id);

    return this.templateRepository.delete(id);
  }
}
