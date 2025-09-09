/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useValidationException } from './lib';
import { corsOptions } from './config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:corsOptions});

  const config = new DocumentBuilder()
    .setTitle('Smart IV Hauz API Docs')
    .setDescription("API documentation for all endpoints used by Smartiv Hauz")
    .setVersion('1.0')
    .addTag('Setapat')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  app.setGlobalPrefix("api")
   app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: useValidationException,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableVersioning({
    defaultVersion:"1",
    type: VersioningType.URI
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
