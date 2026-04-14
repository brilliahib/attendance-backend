import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './infra/config/app.config';
import { setupSwagger } from './infra/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);
  setupSwagger(app);

  const port = process.env.PORT ?? 9000;
  await app.listen(port);

  console.log(`🚀 Server running at port ${port}`);
  console.log(`📖 Swagger docs available at port ${port} route: /docs`);
}

bootstrap();
