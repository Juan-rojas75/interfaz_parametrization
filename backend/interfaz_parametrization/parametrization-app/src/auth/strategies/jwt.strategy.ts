import { Injectable, Logger, UnauthorizedException, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionsService } from 'src/sessions/services/sessions.service';
import { UserService } from 'src/User/services/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecret',
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {

    // ✅ Extraer el token real desde el header
    const token = (req.headers as any).authorization?.replace('Bearer ', '');
    if (!token) {
      this.logger.warn('Token no encontrado en el header.');
      throw new UnauthorizedException('Token no encontrado.');
    }

    
    // 🔥 Buscar la sesión con el token correcto
    const session = await this.sessionsService.findByAccessToken(token);
    if (!session) {
      throw new UnauthorizedException('Sesión inválida o cerrada.');
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    req.user = user;

    return session;
  }
}
