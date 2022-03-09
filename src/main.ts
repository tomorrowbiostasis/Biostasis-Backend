import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod } from '@nestjs/common';
import configuration from './config/default';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configSchema } from './common/validation/config.validation';
import { ExceptionsFilter } from './common/error/exception.filter';

const config = configuration();

async function bootstrap() {
  await configSchema.validateAsync(process.env).catch((error) => {
    throw error;
  });

  const app = await NestFactory.create(AppModule);
  const port = +config.application.port;

  app.useGlobalFilters(new ExceptionsFilter());

  app.setGlobalPrefix(config.application.global_prefix, {
    exclude: [
      { path: '/api/v2/user', method: RequestMethod.PATCH },
      { path: '/api/v2/contact', method: RequestMethod.POST },
      { path: '/api/v2/contact/:id', method: RequestMethod.PATCH },
    ],
  });

  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });

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
