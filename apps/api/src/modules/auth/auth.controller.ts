import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshDto } from "./dto";
import { Public, CurrentUser } from "@common/decorators";
import { JwtRefreshGuard } from "@common/guards";
import type { JwtPayload } from "./strategies/jwt.strategy";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() _dto: RefreshDto, @CurrentUser() payload: JwtPayload) {
    return this.authService.refresh(payload.sub, payload.email);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  //revisar
  @Get("me")
  me(@CurrentUser() user: User) {
    return this.authService.me(user.id);
  }
}
