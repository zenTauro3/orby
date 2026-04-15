import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')
  const configService = app.get(ConfigService)

  const port = configService.getOrThrow<number>('PORT')
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL')

  app.setGlobalPrefix('api')
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  })

  await app.listen(port)
  logger.log(`API corriendo en http://localhost:${port}/api`)
}

bootstrap()