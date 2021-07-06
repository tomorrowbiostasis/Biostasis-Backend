import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { get } from 'config';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configSchema } from './common/validation/config.validation';

async function bootstrap() {
  await configSchema.validateAsync(process.env).catch((error) => {
    throw error;
  });

  const app = await NestFactory.create(AppModule);
  const port = +get('application.port');

  app.setGlobalPrefix(get('application.global_prefix'));
  app.use(helmet());

  setupSwagger(app);

  await app.listen(port);

  Logger.log(`Application running on port: ${port}`);
}

function setupSwagger(app) {
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Biostasis')
      .addBearerAuth()
      .addServer('http:///')
      .addServer('https:///')
      .setDescription('Biostasis API description')
      .setVersion('0.1')
      .build();

    SwaggerModule.setup(
      'swagger',
      app,
      SwaggerModule.createDocument(app, options)
    );
  }
}

bootstrap().catch((e) => {
  Logger.error(e.message || null, e, 'Bootstrap');
});
