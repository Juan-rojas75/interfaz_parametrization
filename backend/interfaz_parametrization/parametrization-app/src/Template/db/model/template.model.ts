import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/Customer/db/model/customer.model';

export type TemplateDocument = Template & Document;

@Schema()
export class Template {


  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer | Types.ObjectId;
  
  @Prop()
  name: string;
  
  @Prop()
  extension: string;

  @Prop()
  default: boolean;
  
  @Prop()
  status: boolean;
  
  @Prop()
  first_line: boolean;
  
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
// 🔹 Agregamos `toJSON` para que `id` esté disponible
TemplateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id?.toString(); // 🔹 Convertimos `_id` en `id`
    delete ret._id;
  },
});