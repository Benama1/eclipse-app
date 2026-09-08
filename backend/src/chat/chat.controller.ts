import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private service: ChatService) {}

  @Get('channels')
  channels() { return this.service.listChannels(); }

  @Get(':channel/history')
  history(@Param('channel') channel: string) { return this.service.history(channel); }
}
