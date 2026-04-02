import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' }); // Allow Next.js to communicate with API
  await app.listen(process.env.PORT || 3001);
}

bootstrap();

