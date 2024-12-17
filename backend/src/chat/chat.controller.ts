import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatService.create(createChatMessageDto);
  }

  @Get('history')
  findAll(@GetUser() user) {
    return this.chatService.findAllByUserId(user.id);
  }
}
