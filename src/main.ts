import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { LoggerServer } from './loggerServer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //define o logger do server com o tipo LoggerServer (customizado)
    logger: new LoggerServer(),
    cors: {
      origin: `${process.env.CORS_ORIGIN}`,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('SIMULA API')
    .setDescription('API para o gerenciamento de simulações de doenças')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(compression());
  await app.listen(3000);
}

bootstrap();
