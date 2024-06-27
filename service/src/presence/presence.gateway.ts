import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Allow Vite dev server
  },
})
export class PresenceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('PresenceGateway');
  private users: { [key: string]: string } = {}; // Store users' presence status

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.users[client.id]) {
      this.broadcastPresence('offline', this.users[client.id]);
      delete this.users[client.id];
    }
  }

  @SubscribeMessage('setPresence')
  handleSetPresence(
    client: Socket,
    payload: { username: string; status: string },
  ): void {
    this.logger.log(
      `Set presence: ${client.id} - ${payload.username} - ${payload.status}`,
    );
    this.users[client.id] = payload.username;
    this.broadcastPresence(payload.status, payload.username);
  }

  private broadcastPresence(status: string, username: string) {
    this.server.emit('presenceUpdate', { username, status });
  }
}
