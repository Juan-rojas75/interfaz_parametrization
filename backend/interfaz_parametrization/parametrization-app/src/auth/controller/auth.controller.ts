import { Controller, Get, Post, Req, UseGuards, Body, Logger } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request } from 'express';
import { Auth } from '../decorators/auth.decorator';
import { RecoveryPassDto } from '../dto/recovery-pass.dto';
import { UserService } from 'src/User/services/user.service';
@Controller('auth')
@ApiTags('auth') 
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Auth() // 🔒 Protegido con JWT
  @Get("profile")
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Req() req) {
    const { user, clientIp, userAgent } = req;
    return this.authService.login(user, clientIp, userAgent);
  }

  @ApiBody({ type: RecoveryPassDto })
  @Post('recovery_pass')
  async recoveryPass(@Body() recoveryPassDto: RecoveryPassDto) {
    return this.authService.recoveryPass(recoveryPassDto);
  }

  @Auth() // 🔒 Protegido con JWT
  @Post('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user.accessToken);
  }

  @Auth() // 🔒 Protegido con JWT
  @Post('logoutAll')
  async logoutAll(@Req() req) {
    this.logger.log(`USER: ${req.user}`);
    return this.authService.logoutAll(req.user.userId);
  }
}
