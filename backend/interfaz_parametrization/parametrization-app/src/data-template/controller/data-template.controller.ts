import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DataTemplateService } from '../services/data-template.service';
import { CreateDataTemplateDto } from '../dto/create-data-template.dto';
import { UpdateDataTemplateDto } from '../dto/update-data-template.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';

@Controller('data-template')
export class DataTemplateController {
  constructor(private readonly dataTemplateService: DataTemplateService) {}

  @Post()
  create(@Body() createDataTemplateDto: CreateDataTemplateDto) {
    return this.dataTemplateService.create(createDataTemplateDto);
  }

  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.dataTemplateService.findAll(paginatorDto);
  }

  @Get('template/:id_template')
  findOneByTemplate(@Param('id_template') id: string) {
    return this.dataTemplateService.findByTemplate(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataTemplateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataTemplateDto: UpdateDataTemplateDto) {
    return this.dataTemplateService.update(id, updateDataTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataTemplateService.remove(id);
  }
}
