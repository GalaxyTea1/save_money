import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
