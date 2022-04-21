import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerServer } from './loggerServer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //define o logger do server com o tipo LoggerServer (customizado)
    logger: new LoggerServer(),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
