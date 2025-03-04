import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
     private readonly logger = new Logger(JwtAuthGuard.name);
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    // handleRequest(err, user, info) {
    // this.logger.log(user);
    // this.logger.log(err);
    // if (err || !user) {
    //     throw new UnauthorizedException('Not authenticated.');
    // }
    // return user; // ✅ Devuelve el usuario autenticado
    // }
}
