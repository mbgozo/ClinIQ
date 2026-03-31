import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [ChatController],
  providers: [ChatService, MessagesService, ConversationsService],
  exports: [ChatService, MessagesService, ConversationsService],
})
export class ChatModule {}
