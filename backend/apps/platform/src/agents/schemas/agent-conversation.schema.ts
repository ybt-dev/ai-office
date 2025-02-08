import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type AgentConversationDocument = HydratedDocument<AgentConversation>;

@Schema({ timestamps: true })
export class AgentConversation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  sourceAgent: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  targetAgent: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  team: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  content: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const AgentConversationSchema = SchemaFactory.createForClass(AgentConversation);

AgentConversationSchema.index({ organization: 1, team: 1 }, { unique: true });
