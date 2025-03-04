import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 
import { Customer } from 'src/Customer/db/model/customer.model';
import { Rol } from 'src/roles/db/model/roles.model';

export type UserDocument = User & Document; 

@Schema() 
export class User {
  @Prop() 
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  access_token: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Rol', required: true })
  rol: Rol | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer | Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User); 