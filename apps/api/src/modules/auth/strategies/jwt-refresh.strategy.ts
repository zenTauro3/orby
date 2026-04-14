import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '../../../common/redis/redis.service';

interface JwtRefreshPayload {
  sub: string;
  email: string;
}

interface RefreshTokenBody {
  refreshToken?: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): Promise<{ id: string; email: string }> {
    const body = req.body as RefreshTokenBody;
    const refreshToken = body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const stored = await this.redisService.get(
      `refresh_token:${payload.sub}`,
    );

    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    return { id: payload.sub, email: payload.email };
  }
}
