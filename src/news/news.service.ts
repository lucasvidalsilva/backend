import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NewsService {
  private readonly apiKey = process.env.API_KEY_NEWS;
  private readonly url = 'https://newsapi.org/v2/everything';

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR, { name: 'fetchAndSaveNewsCron' })
  async fetchAndSaveNews() {
    try {
      const response = await axios.get(this.url, {
        params: {
          q: 'golpes-financeiros',
          apiKey: this.apiKey,
          pageSize: 10,
        },
      });

      const articles = response.data.articles;
      const MAX_CONTENT_LENGTH = 500;

      for (const article of articles) {
        if (!article.title || typeof article.title !== 'string') {
          console.warn('Artigo ignorado por falta de título válido:', article);
          continue;
        }

        const fullContent = article.description || article.content || '';

        let content = fullContent;
        if (content.length > MAX_CONTENT_LENGTH) {
          content = content.substring(0, MAX_CONTENT_LENGTH) + '...';
        }

        const existing = await this.prisma.news.findFirst({
          where: { title: article.title },
        });

        if (!existing) {
          await this.prisma.news.create({
            data: {
              title: article.title,
              content: content,
              fullContent: fullContent,
              source: article.source.name,
              url: article.url,
            },
          });
        }
      }
      console.log('News fetched and saved successfully.');
    } catch (error) {
      console.error('Error fetching and saving news:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    }
  }

  async getNews(limit: number = 10) {
    return this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}