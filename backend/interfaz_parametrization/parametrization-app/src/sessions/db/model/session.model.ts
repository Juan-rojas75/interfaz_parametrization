import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  id?: string; // 🔹 Agregamos `id` explícitamente
  _id?: Types.ObjectId; // 🔹 Declaramos `_id` también

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken?: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  revokedAt?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
// 🔹 Agregamos `toJSON` para que `id` esté disponible
SessionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id?.toString(); // 🔹 Convertimos `_id` en `id`
    delete ret._id;
  },
});
