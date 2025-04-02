import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}