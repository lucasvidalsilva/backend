import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedRequest } from 'src/quiz/req/authenticated-request';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('questions')
  async getQuestions() {
    return this.quizService.getQuestions();
  }

  @UseGuards(JwtGuard)
  @Post('score')
  async saveScore(@Req() request: AuthenticatedRequest, @Body('score') score: number) {
    console.log("Usuário autenticado:", request.user);
    if (!request.user) {
      throw new Error('Usuário não autenticado');
    }
    return this.quizService.saveScore(request.user.id, score);
  }

  @Get('ranking')
  async getRanking() {
    return this.quizService.getRanking();
  }
}
