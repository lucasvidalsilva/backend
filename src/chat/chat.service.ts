import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage(username: string, content: string) {
    await this.delay(2000);
    return this.prisma.message.create({
      data: {
        username,
        content,
      },
    });
  }

  async getMessages() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}