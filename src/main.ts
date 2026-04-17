import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       
    forbidNonWhitelisted: true, 
    transform: true,       
  }));

  // 2. Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Secure banking API for customers and administrators')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 3. Enable CORS (Penting untuk akses dari Frontend/Browser)
  app.enableCors();

  // 4. Konfigurasi Port untuk Railway
  // Railway memberikan port secara dinamis melalui process.env.PORT
  const port = process.env.PORT || 3000;

  // 5. Listen pada 0.0.0.0
  // WAJIB: Agar aplikasi bisa menerima trafik dari luar container Railway
  await app.listen(port, '0.0.0.0');

  // 6. Log yang lebih informatif
  logger.log(`✅ Application is running on port: ${port}`);
  
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    logger.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    logger.log(`📚 Swagger Docs: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api-docs`);
  } else {
    logger.log(`🚀 Local URL: http://localhost:${port}`);
    logger.log(`📚 Local Swagger Docs: http://localhost:${port}/api-docs`);
  }
}

bootstrap();