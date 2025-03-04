import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });

  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      // "preflightContinue": false
    }
  );

  const configService = app.get(ConfigService);

  const version = configService.get('API_VERSION') || 'v1';

  app.setGlobalPrefix(`api/${version}`);
  app.useGlobalGuards();
  app.useGlobalPipes(new ValidationPipe());

  // Configurar títulos de documentación
  const options = new DocumentBuilder() 
    .setTitle('Parametrizatión REST API')
    .setDescription('API REST para parametrización de interfaces')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options); 

  // La ruta en que se sirve la documentación
  SwaggerModule.setup('api', app, document); 

  const PORT = configService.get('PORT') || 3000;

  await app.listen(PORT);
  Logger.log('🚀 Servidor iniciado en http://localhost:3001', 'Bootstrap');
}
bootstrap();
