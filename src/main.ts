import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('/api/v1');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Github repository indexer')
    .setDescription('Simple Github repository indexer')
    .setVersion('1.0')
    .addTag('Indexer 1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/documentation', app, document);
  await app.listen(3000);
}
bootstrap();
