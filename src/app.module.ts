import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { NewsModule } from './news/news.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), UserModule, AuthModule, ChatModule, NewsModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
