import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true }) channel: string; // general | support | annonces | ... (extensible)
  @Prop({ required: true }) user: string;
  @Prop({ required: true }) role: string; // admin | collab | employee
  @Prop({ required: true }) text: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
