import { Inject, Injectable } from '@nestjs/common';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { DashboardRepository } from '../db/repository/dashboard.repository';
import { CreateDashboardDto } from '../dto/create-dashboard.dto';
import { UpdateDashboardDto } from '../dto/edit-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
      @Inject('DashboardRepositoryInterface')
      private readonly dashboardRepository: DashboardRepository,
    ) {
    }
  create(createDashboardDto: CreateDashboardDto) {
    createDashboardDto.createdAt = new Date();
    createDashboardDto.updatedAt = new Date();
    return this.dashboardRepository.create(createDashboardDto);
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.dashboardRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.dashboardRepository.findOneById(id);
  }

  update(id: string, updateDashboardDto: UpdateDashboardDto) {
    return this.dashboardRepository.update(id, updateDashboardDto);
  }

  remove(id: string) {
    return this.dashboardRepository.delete(id);
  }

}
