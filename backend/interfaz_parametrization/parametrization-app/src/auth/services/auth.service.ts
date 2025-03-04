import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { User, UserDocument } from 'src/User/db/model/user.model';
import { SessionsService } from 'src/sessions/services/sessions.service';
import { UserService } from 'src/User/services/user.service';
import { RecoveryPassDto } from '../dto/recovery-pass.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: UserDocument, ip: string, userAgent: string) : Promise<LoginResponseDto> {
    if (user.id) {
      //Valid ip
      const payload = { sub: user.id.toString(), email: user.email };
      const sessionIp_ = await this.sessionsService.findByIp(ip);
      
      if (sessionIp_ && sessionIp_._id){
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.sessionsService.update(sessionIp_._id.toString(), { user: user.id, accessToken, refreshToken, ip, userAgent , revokedAt: null });

        return {status: 200, message: 'Login successful', error: false, data: {access_token: accessToken, refresh_token: refreshToken, user: user}};
      }
      else{
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        this.sessionsService.create({ user: user.id, accessToken, refreshToken, ip, userAgent });
  
        return {status: 200, message: 'Login successful', error: false, data: { access_token: accessToken, refresh_token: refreshToken, user: user}};
      }
    }
    else{
      throw new UnauthorizedException('User not found');
    }
  }

  async recoveryPass(recoveryPassDto: RecoveryPassDto) {
    const user = await this.userService.findByEmail(recoveryPassDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (recoveryPassDto.password !== recoveryPassDto.password_confirm) {
      throw new UnauthorizedException('Passwords do not found');
    }


    const password_ = await bcrypt.hash(recoveryPassDto.password, 10);
    if (user.id) {
      this.userService.update(user.id, { password: password_ });
    }

    return {status: 200, message: 'Password changed successfully', error: false};
  }

  async logout(accessToken: string) {
    const session = await this.sessionsService.findByAccessToken(accessToken);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    return await this.sessionsService.revoke(session.id);
  }

  async logoutAll(userId: string) {
    return await this.sessionsService.revokeAll(userId);
  }
}
