import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { DataSource } from 'typeorm';



@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(private dataSource: DataSource) {

    super();

  }



  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];



    if (authHeader) {

      const token = authHeader.replace('Bearer ', '').trim();



      // Consultamos directamente en la tabla token_blacklist de PostgreSQL

      const blacklisted = await this.dataSource.query(

        'SELECT * FROM token_blacklist WHERE token = $1 LIMIT 1',

        [token],

      );



      if (blacklisted && blacklisted.length > 0) {

        throw new UnauthorizedException('El token ya ha sido invalidado (Sesión cerrada).');

      }

    }



    return super.canActivate(context) as boolean;

  }

}

