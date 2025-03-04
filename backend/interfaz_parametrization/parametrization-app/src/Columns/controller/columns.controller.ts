import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { CreateColumnsDto } from "src/Columns/dto/create-columns.dto";
import { UpdateColumnsDto } from "src/Columns/dto/update-columns.dto";
import { ApiTags } from '@nestjs/swagger';
import { ColumnsService } from '../services/columns.service';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';

@Controller('columns')
@ApiTags('columns') 
export class ColumnsController {
  constructor(private readonly Service: ColumnsService) {}

  @Post()
  create(@Body() createDto: CreateColumnsDto) {
    return this.Service.create(createDto);
  }

  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.Service.findAll(paginatorDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateColumnsDto) {
    return this.Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.Service.remove(id);
  }
}
