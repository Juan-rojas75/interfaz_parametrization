import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/Customer/db/model/customer.model';



export type DashboardDocument = Dashboard & Document;

@Schema()
export class Dashboard {
  id?: string;
  _id?: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer | Types.ObjectId;

  @Prop()
  type: string;

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'completed', 'failed'] })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Prop({ default: 0 })
  recordsProcessed: number;

  @Prop({ default: 0 })
  totalTemplatesGenerated: number;

  @Prop({ default: 0 })
  totalSuccessfulProcesses: number;

  @Prop({ default: 0 })
  totalFailedProcesses: number;
  
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
// 🔹 Agregamos `toJSON` para que `id` esté disponible
DashboardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id?.toString(); // 🔹 Convertimos `_id` en `id`
    delete ret._id;
  },
});
