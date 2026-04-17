import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚀 RevoBank API is Online! Visit <a href="/api-docs">/api-docs</a> for documentation.';
  }
}