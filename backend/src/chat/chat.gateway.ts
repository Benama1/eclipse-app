import {
  ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

/**
 * Chat CE — WebSocket temps réel (Socket.io), persisté dans MongoDB.
 * Règle métier ECLIPSE : contrairement aux autres modules, TOUS les rôles
 * (Admin CE, Collaborateur CE, Salarié) ont le droit de lire ET écrire ici.
 */
@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN || '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService, private jwt: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      const payload: any = this.jwt.verify(token as string);
      (client as any).user = payload;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('join')
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() channel: string) {
    client.join(channel);
    const history = await this.chatService.history(channel);
    client.emit('history', history);
  }

  @SubscribeMessage('message')
  async onMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { channel: string; text: string }) {
    const user = (client as any).user;
    if (!user) return;
    // Tous les rôles peuvent écrire dans le chat — aucune restriction ici (exception métier).
    const msg = await this.chatService.post(body.channel, `${user.firstname} ${user.lastname}`, user.role, body.text);
    this.server.to(body.channel).emit('message', msg);
  }
}
