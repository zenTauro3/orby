// src/modules/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RedisService } from '@core/redis/redis.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthResponse } from '@orby/types'
import { JwtPayload } from './strategies/jwt.strategy'

const BCRYPT_ROUNDS = 12
const ACCESS_TOKEN_TTL = 60 * 15            // 15 minutos
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7  // 7 días

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('Este email ya está registrado')
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    })

    return this.generateTokens(user.id, user.email)
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email)

    // mismo mensaje para email y contraseña incorrectos
    // nunca revelar si el email existe en la BD
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    return this.generateTokens(user.id, user.email)
  }

  async refresh(userId: string, email: string): Promise<AuthResponse> {
    // JwtRefreshGuard ya verificó que el token en Redis es válido
    // aquí solo generamos nuevos tokens con rotación
    return this.generateTokens(userId, email)
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.redisService.del(`refresh_token:${userId}`)
    return { message: 'Sesión cerrada correctamente' }
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId)

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: userId, email }

    // generamos ambos tokens y cargamos el usuario en paralelo
    const [accessToken, refreshToken, user] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: ACCESS_TOKEN_TTL,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_TTL,
      }),
      this.usersService.findById(userId),
    ])

    // rotación — siempre guardamos el refresh token más reciente
    // el anterior queda invalidado automáticamente
    await this.redisService.set(
      `refresh_token:${userId}`,
      refreshToken,
      REFRESH_TOKEN_TTL,
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        role: user!.role,
        companyId: user!.companyId,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
      },
    }
  }
}