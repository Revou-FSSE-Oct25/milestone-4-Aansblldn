import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       
    forbidNonWhitelisted: true, 
    transform: true,       
  }));


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

  const customOptions = {
    customSiteTitle: "RevoBank API Documentation",
    customCss: `
      .swagger-ui .topbar { 
        background-color: #ffffff; 
        border-bottom: 1px solid #f1f5f9;
        padding: 15px 0;
      }
      .swagger-ui .topbar-wrapper img { 
        content: url('https://cdn-icons-png.flaticon.com/512/2830/2830284.png'); 
        width: 35px; 
      }
      
      
      .swagger-ui .opblock.opblock-post { background: #f0fdf4; border-color: #bbf7d0; } /* Hijau Pastel */
      .swagger-ui .opblock.opblock-get { background: #eff6ff; border-color: #dbeafe; }  /* Biru Pastel */
      .swagger-ui .opblock.opblock-put { background: #fffbeb; border-color: #fef3c7; }  /* Kuning Pastel */
      .swagger-ui .opblock.opblock-delete { background: #fef2f2; border-color: #fee2e2; } /* Merah Pastel */

    
      .swagger-ui .btn.execute { 
        background-color: #3bc5c9; 
        border-color: #3bc5c9; 
        color: white; 
        border-radius: 6px; 
      }
      .swagger-ui .auth-wrapper .authorize { 
        background-color: #3bc5c9; 
        border-color: #3bc5c9; 
        border-radius: 6px; 
        color: white;
      }
      
    
      .swagger-ui .info .title { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        color: #0f172a; 
      }
      .swagger-ui .scheme-container { 
        background: transparent; 
        box-shadow: none; 
        border-top: 1px solid #f1f5f9; 
      }
    `,
  };

  SwaggerModule.setup('api-docs', app, document, customOptions);

 
  app.enableCors();


  const port = process.env.PORT || 3000;


  await app.listen(port, '0.0.0.0');


  logger.log(`✅ Application is running on port: ${port}`);
  
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    logger.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    logger.log(`📚 Swagger Docs: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api-docs`);
  } else {
    const url = await app.getUrl();
    logger.log(`🚀 Local URL: ${url}`);
    logger.log(`📚 Local Swagger Docs: ${url}/api-docs`);
  }
}

bootstrap();