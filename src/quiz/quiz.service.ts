import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async getQuestions() {
    return this.prisma.questao.findMany();
  }

  async saveScore(userId: number, score: number) {
    return this.prisma.score.create({
      data: {
        userId,
        score,
      },
    });
  }

  async getRanking() {
    const scores = await this.prisma.score.findMany({
      orderBy: { score: 'desc' },
      take: 3,
      include: { user: { select: { name: true } } },
    });

    return scores.map((score, index) => ({
      position: index + 1,
      name: score.user.name || 'Usuário Anônimo', 
      score: score.score,
    }));
  }
}