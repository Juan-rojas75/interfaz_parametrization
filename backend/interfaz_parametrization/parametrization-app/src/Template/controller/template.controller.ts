import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TemplateService } from '../services/template.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ApiTags } from '@nestjs/swagger';



@Controller('templates')
@ApiTags('templates') 
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.templateService.findAll(paginatorDto);
  }
  
  @Get('templates_by_customer/:id_customer')
  findByCustomer_Id(@Param('id_customer') id_customer: string) {
    return this.templateService.findByCustomer_Id(id_customer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
