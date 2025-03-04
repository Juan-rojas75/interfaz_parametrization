import { Module } from '@nestjs/common';
import { DataTemplateController } from './controller/data-template.controller';
import { DataTemplateService } from './services/data-template.service';
import { DataTemplateRepository } from './db/repository/data-template.repository';
import { DataTemplate, DataTemplateSchema } from './db/model/data-template.model';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forFeature([{ name: DataTemplate.name, schema: DataTemplateSchema }])],
  controllers: [DataTemplateController],
  providers: [
        DataTemplateService,
        {
            provide: 'DataTemplateRepositoryInterface',
            useClass: DataTemplateRepository
          }
        ],
  exports: [DataTemplateService]
})
export class DataTemplateModule {}
