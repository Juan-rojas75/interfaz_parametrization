import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DataType } from 'src/common/interfaces/type-data.interface';
import { Template } from 'src/Template/db/model/template.model';


export type DataTemplateDocument = DataTemplate & Document;

@Schema()
export class DataTemplate {
  id?: string;
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Template', required: true })
  template: Template | Types.ObjectId;
  
  @Prop()
  index: number;

  @Prop()
  length: number;

  @Prop()
  name: string;
  
  @Prop()
  link_name: string;
  
  @Prop()
  default: string;

  @Prop({ type: [{ value: Number, name: String }] })
  value_default: { value: number; name: string }[];
  
  @Prop({ enum: DataType })
  type: DataType;

  @Prop({ type: String, required: false })
  format_date?: string;

  @Prop()
  complete_with: string;
  
  @Prop()
  align: string;
  
  @Prop()
  type_calcule: string;
  
  @Prop()
  first_line: boolean;

  @Prop({ type: [{ default: String, replace: String }] })
  valuesTransform: { default: string; replace: string }[];
  
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DataTemplateSchema = SchemaFactory.createForClass(DataTemplate);
// 🔹 Agregamos `toJSON` para que `id` esté disponible
DataTemplateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id?.toString(); // 🔹 Convertimos `_id` en `id`
    delete ret._id;
  },
});
