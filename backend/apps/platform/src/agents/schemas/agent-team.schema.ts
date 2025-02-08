import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type AgentTeamDocument = HydratedDocument<AgentTeam>;

@Schema({ timestamps: true })
export class AgentTeam {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  strategy: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  organization: ObjectId;

  @Prop({ required: false, type: mongoose.Schema.Types.String })
  imageUrl?: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  createdBy: Object;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  updatedBy: Object;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ required: false, type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const AgentTeamSchema = SchemaFactory.createForClass(AgentTeam);

AgentTeamSchema.index({ organization: 1 }, { unique: true });
