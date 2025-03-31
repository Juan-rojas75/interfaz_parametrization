import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { DashboardService } from '../services/dashboard.service';
import { CreateDashboardDto } from '../dto/create-dashboard.dto';
import { UpdateDashboardDto } from '../dto/edit-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  create(@Body() createDahboardDto: CreateDashboardDto) {
    return this.dashboardService.create(createDahboardDto);
  }

  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.dashboardService.findAll(paginatorDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDahboardDto: UpdateDashboardDto) {
    return this.dashboardService.update(id, updateDahboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(id);
  }
}
