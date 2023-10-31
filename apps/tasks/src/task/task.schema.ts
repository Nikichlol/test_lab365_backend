import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'apps/auth/src/modules/user/user.schema';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
