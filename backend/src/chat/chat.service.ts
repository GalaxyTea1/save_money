import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async create(createChatMessageDto: CreateChatMessageDto) {
    const message = this.chatMessageRepository.create(createChatMessageDto);
    return await this.chatMessageRepository.save(message);
  }

  async findAllByUserId(userId: number) {
    return await this.chatMessageRepository.find({
      where: { user_id: userId },
      order: { createdAt: 'ASC' },
    });
  }
}
