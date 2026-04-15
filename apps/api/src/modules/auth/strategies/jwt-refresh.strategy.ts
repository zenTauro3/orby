import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { RedisService } from '@core/redis/redis.service'
import { JwtPayload } from './jwt.strategy'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.body?.refreshToken as string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token no proporcionado')
    }

    const storedToken = await this.redisService.get(
      `refresh_token:${payload.sub}`,
    )

    if (!storedToken) {
      throw new UnauthorizedException('Sesión expirada — inicia sesión de nuevo')
    }

    if (storedToken !== refreshToken) {
      await this.redisService.del(`refresh_token:${payload.sub}`)
      throw new UnauthorizedException('Refresh token inválido')
    }

    return payload
  }
}