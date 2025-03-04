import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum IdentificationType {
  NIT = 'NIT',
}

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop()
  name: string;

  @Prop({ enum: IdentificationType })
  identitycation_type: IdentificationType;

  @Prop()
  identificacion: string;
  
  @Prop()
  status: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const customerId = this._id.toString();
  await this.model('User').deleteMany({ customer: customerId });
  await this.model('Template').deleteMany({ customer: customerId });
  next();
});
