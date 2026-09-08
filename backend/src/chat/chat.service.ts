import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, MessageDocument } from './message.schema';

const DEFAULT_CHANNELS = ['general', 'support', 'annonces'];

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private model: Model<MessageDocument>) {}

  async listChannels(): Promise<string[]> {
    const distinct = await this.model.distinct('channel');
    const merged = Array.from(new Set([...DEFAULT_CHANNELS, ...distinct]));
    return merged;
  }

  async history(channel: string, limit = 200) {
    return this.model.find({ channel }).sort({ createdAt: 1 }).limit(limit).exec();
  }

  async post(channel: string, user: string, role: string, text: string) {
    const msg = await this.model.create({ channel, user, role, text });
    return msg;
  }
}
