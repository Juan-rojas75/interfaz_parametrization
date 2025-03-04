import { Module } from '@nestjs/common';
import { ColumnsController } from './controller/columns.controller';
import { ColumnsService } from './services/columns.service';
import { Columns, ColumnsSchema } from './db/model/columns.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsRepository } from './db/repository/column.repository';


@Module({
  imports: [MongooseModule.forFeature([{ name: Columns.name, schema: ColumnsSchema }])],
  controllers: [ColumnsController],
  providers: [
    ColumnsService,
    {
        provide: 'ColumnsRepositoryInterface',
        useClass: ColumnsRepository
      }
    ],
})
export class ColumnsModule {}
