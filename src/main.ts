import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const dbName = configService.get('PGDATABASE');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation For Elsapsial API')
    .setDescription('This API is user for Elsapsial backend test')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(3000);
    console.log(`Berhasil terhubung ke database ${dbName}`);
    console.log(`Swagger UI is running on http://localhost:3000/api`);
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
  }
}
bootstrap();
