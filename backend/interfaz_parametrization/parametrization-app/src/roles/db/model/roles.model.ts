import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

export type RolDocument = Rol & Document; 

@Schema() 
export class Rol {
  @Prop() 
  name: string;

  @Prop() 
  description: string;

  @Prop() 
  permissons: string[];

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: true })
  isAdmin: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop({ default: Date.now })
  updatedAt: Date;

}

export const RolSchema = SchemaFactory.createForClass(Rol); 