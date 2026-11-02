import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { correo: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó el token de autorización');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    await this.authService.logout(token);

    return {
      estado: true,
      mensaje: 'Sesión cerrada exitosamente y token invalidado.',
    };
  }
}