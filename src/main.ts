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

  // 2. Swagger API Documentation Metadata
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Introducing an entirely new way to manage your banking experience.')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT', 
        name: 'JWT', 
        in: 'header' 
      }, 
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 3. Customizing Swagger UI - Ultra-Minimalist & Limehome Aesthetic
  const customOptions = {
    customSiteTitle: "RevoBank | Welcome Home",
    customCss: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

      body { 
        background-color: #ffffff; 
        font-family: 'Inter', sans-serif !important; 
        color: #2d3436;
      }

      .swagger-ui .topbar { 
        background-color: #ffffff; 
        border-bottom: 1px solid #f0f0f0;
        padding: 20px 0;
        box-shadow: none;
      }
      .swagger-ui .topbar-wrapper img { 
        content: url('https://cdn-icons-png.flaticon.com/512/3135/3135715.png'); 
        width: 30px; 
      }

      .swagger-ui .info .title { 
        font-size: 42px; 
        font-weight: 300; 
        letter-spacing: -1.5px; 
        color: #2d3436;
        margin-top: 50px;
      }
      .swagger-ui .info p { font-size: 16px; color: #636e72; line-height: 1.8; font-weight: 300; }

      .swagger-ui .btn.execute, 
      .swagger-ui .auth-wrapper .authorize { 
        background-color: #4fac9d; 
        color: white; 
        border: none; 
        border-radius: 4px; 
        font-weight: 400;
        padding: 8px 30px;
        transition: all 0.3s ease;
      }
      .swagger-ui .btn.execute:hover { background-color: #3d8b7f; }

      .swagger-ui .opblock { 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
        border: 1px solid #f1f1f1 !important;
        margin-bottom: 15px;
        background: #ffffff !important;
      }
      
      .swagger-ui .opblock.opblock-post { border-left: 5px solid #4fac9d !important; }
      .swagger-ui .opblock.opblock-get { border-left: 5px solid #74b9ff !important; }
      .swagger-ui .opblock.opblock-put { border-left: 5px solid #feca57 !important; }
      .swagger-ui .opblock.opblock-delete { border-left: 5px solid #ff7675 !important; }

      .swagger-ui .scheme-container { 
        background: #fafafa; 
        padding: 30px 0; 
        box-shadow: none;
        border-radius: 12px;
        border: 1px solid #f0f0f0;
        margin-top: 30px;
      }
      .swagger-ui input, .swagger-ui select {
        border-radius: 4px !important;
        border: 1px solid #e0e0e0 !important;
      }
    `,
  };

  SwaggerModule.setup('api-docs', app, document, customOptions);

  // 4. Enable CORS
  app.enableCors();

  // 5. Port Configuration for Railway
  const port = process.env.PORT || 3000;

  // 6. Listen on 0.0.0.0
  await app.listen(port, '0.0.0.0');

  // 7. Informative Logging
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