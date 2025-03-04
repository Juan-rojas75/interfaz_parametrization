import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DataType } from 'src/common/interfaces/type-data.interface';
import { Customer } from 'src/Customer/db/model/customer.model';


export type ColumnsDocument = Columns & Document;

@Schema()
export class Columns {
  @Prop()
  name: string;

  @Prop()
  container: string;

  @Prop({ enum: DataType })
  type: DataType;

  @Prop({ type: [{ value: Number, name: String }] })
  valuesDefault: { value: number; name: string }[];

  @Prop()
  status: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer | Types.ObjectId;
}

export const ColumnsSchema = SchemaFactory.createForClass(Columns);
