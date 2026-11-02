import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(credenciales: { correo: string; password: string }) {
    const { correo, password } = credenciales;

    const result = await this.dataSource.query(
      'SELECT sp_usuario_login($1, $2) AS resultado',
      [correo, password],
    );

    const respuestaSp = result[0].resultado;

    if (!respuestaSp.estado) {
      throw new UnauthorizedException(respuestaSp.mensaje);
    }

    const usuario = respuestaSp.datos;
    const payload = { 
      sub: usuario.codigousuario, 
      empleadoId: usuario.codigoempleado,
      correo: usuario.correo, 
      puesto: usuario.puesto 
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_EXPIRATION') || '15s') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d') as any,
    });

    return {
      estado: true,
      mensaje: 'Login exitoso',
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const newPayload = { 
        sub: payload.sub, 
        empleadoId: payload.empleadoId,
        correo: payload.correo, 
        puesto: payload.puesto 
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_EXPIRATION') || '15s') as any,
      });

      return {
        estado: true,
        mensaje: 'Token renovado correctamente',
        accessToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(token: string) {
    try {
      // Decodificamos el token para extraer su fecha de expiración (exp)
      const decoded: any = this.jwtService.decode(token);
      let expiryDate = new Date();

      if (decoded && decoded.exp) {
        expiryDate = new Date(decoded.exp * 1000);
      } else {
        expiryDate.setDate(expiryDate.getDate() + 1); // Fallback de 1 día
      }

      // Guardamos el token en la lista negra usando consultas nativas de PostgreSQL
      await this.dataSource.query(
        'INSERT INTO token_blacklist (token, expiry_date) VALUES ($1, $2)',
        [token, expiryDate],
      );

      return true;
    } catch (error) {
      console.error('Error al revocar el token:', error);
      throw new UnauthorizedException('No se pudo procesar el cierre de sesión');
    }
  }
}

export { AuthService };