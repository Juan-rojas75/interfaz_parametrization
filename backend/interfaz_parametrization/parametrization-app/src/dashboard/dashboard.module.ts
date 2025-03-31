import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { DashboardRepository } from './db/repository/dashboard.repository';
import { Dashboard, DashboardSchema } from './db/model/dashboard.model';


@Module({
  imports: [MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }])],
  controllers: [DashboardController],
  providers: [
        DashboardService,
        {
            provide: 'DashboardRepositoryInterface',
            useClass: DashboardRepository
          }
        ],
  exports: [DashboardService]
})
export class DashboardModule {}
