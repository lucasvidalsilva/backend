import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(
      sendMessageDto.username,
      sendMessageDto.content,
    );
  }

  @Get('messages')
  async getMessages() {
    return this.chatService.getMessages();
  }
}