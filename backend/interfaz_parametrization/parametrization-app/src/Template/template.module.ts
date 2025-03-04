import { Module } from "@nestjs/common";
import { TemplateService } from "./services/template.service";
import { TemplateController } from "./controller/template.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Template, TemplateSchema } from "./db/model/template.model";
import { TemplateRepository } from "./db/repository/template.repository";
import { DataTemplateModule } from "src/data-template/data-template.module";
@Module({
  imports: [
    DataTemplateModule,
    MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }])],
  controllers: [TemplateController],
  providers: [
      TemplateService,
      {
          provide: 'TemplateRepositoryInterface',
          useClass: TemplateRepository
        }
      ],
  exports: []
})
export class TemplateModule {}

