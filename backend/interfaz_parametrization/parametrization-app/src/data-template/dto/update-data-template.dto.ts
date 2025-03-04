import { PartialType } from '@nestjs/swagger';
import { CreateDataTemplateDto } from './create-data-template.dto';

export class UpdateDataTemplateDto extends PartialType(CreateDataTemplateDto) {}
