import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['clientIp'] = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req['userAgent'] = req.headers['user-agent'];
    next();
  }
}
