import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresenceGateway } from './presence/presence.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PresenceGateway],
})
export class AppModule {}
